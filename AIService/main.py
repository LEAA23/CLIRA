import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from embeddings.search import router as embeddings_router

import traceback

#Inicializamos la API
app = FastAPI(
    title="CLIRA AI Service",
    description="Servicio de predicción de diagnósticos",
    version="1.0.0"
)

app.include_router(
    embeddings_router,
    prefix="/embeddings",
    tags=["Embeddings"]
)

#Cargar el modelo que hemos entrenado anteriormente
RUTA_MODELO = Path(__file__).parent / "modelo_clira.pkl"

artefacto = joblib.load(RUTA_MODELO)

modelo = artefacto["modelo"]
imputador = artefacto["imputador"]
columnas = artefacto["columnas"]

print("Modelo CLIRA cargado correctamente")
print("Características:", len(columnas))
print("Diagnósticos:", len(modelo.classes_))

#Estructura de entrada de datos que va a mandar los estudiantes

# Estructura de entrada
class DatosPaciente(BaseModel):
    features: dict[str, float | str | None]


# Endpoint de predicción
@app.post("/predict")
def predecir(datos: DatosPaciente):

    try:
        caracteristicas = datos.features

        # Validar columnas desconocidas
        desconocidas = [
            c for c in caracteristicas
            if c not in columnas
        ]

        if desconocidas:
            raise HTTPException(
                status_code=400,
                detail=f"Características desconocidas: {desconocidas}"
            )

        # Crear DataFrame
        entrada = pd.DataFrame([caracteristicas])

        # Garantizar que existan todas las columnas
        entrada = entrada.reindex(columns=columnas)

        # Convertir Blood Pressure a object si existe
        if "Blood Pressure" in entrada.columns:
            entrada["Blood Pressure"] = entrada["Blood Pressure"].astype("object")

        # Construir entrada con las columnas originales
        entrada = pd.DataFrame(
            [[caracteristicas.get(c) for c in columnas]],
            columns=columnas
        )

        # Convertir a numérico, excepto Blood Pressure
        columnas_numericas = [
            c for c in columnas
            if c != "Blood Pressure"
        ]

        entrada[columnas_numericas] = entrada[columnas_numericas].apply(
            pd.to_numeric,
            errors="coerce"
        )

        if "Blood Pressure" in entrada.columns:
            entrada["Blood Pressure"] = entrada["Blood Pressure"].astype("object")
        else:
            print("ADVERTENCIA: Blood Pressure no existe en entrada")
            print("Columnas disponibles:", entrada.columns.tolist())
            print("Columnas esperadas:", columnas)        

        # Validar valores infinitos
        valores_numericos = entrada[columnas_numericas].to_numpy(
            dtype=np.float64
        )

        if np.isinf(valores_numericos).any():
            raise HTTPException(
                status_code=400,
                detail="Se recibieron valores infinitos."
            )

        # Imputar datos faltantes
        entrada_imp = imputador.transform(entrada)

        entrada_imp = np.asarray(
            entrada_imp,
            dtype=np.float32
        )

        # Obtener probabilidades
        probabilidades = modelo.predict_proba(entrada_imp)[0]

        # Obtener Top-3
        indices = np.argsort(probabilidades)[::-1][:3]

        resultados = []

        for posicion, indice in enumerate(indices, start=1):
            resultados.append({
                "posicion": posicion,
                "diagnostico": str(modelo.classes_[indice]),
                "puntuacion": round(
                    float(probabilidades[indice]) * 100,
                    2
                )
            })

        return {
            "success": True,
            "predicciones": resultados
        }

    except HTTPException:
        raise

    except Exception as e:
        print("\nERROR DURANTE LA PREDICCIÓN:")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Error al generar la predicción: {str(e)}"
        )
