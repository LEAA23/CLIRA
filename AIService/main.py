import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from embeddings.search import router as embeddings_router


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
class DatosPaciente(BaseModel):
    features: dict[str, float | None]

#Endoints de prediccion
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

        # Construir entrada con las columnas originales
        entrada = pd.DataFrame(
            [[caracteristicas.get(c) for c in columnas]],
            columns=columnas
        )

        # Convertir a numérico
        entrada = entrada.apply(
            pd.to_numeric,
            errors="coerce"
        ).astype("float32")

        # Validar valores infinitos
        if np.isinf(entrada.to_numpy()).any():
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
        probabilidades = modelo.predict_proba(
            entrada_imp
        )[0]

        # Ordenar predicciones
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

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Error al generar la predicción."
        )

#Verificar el servicio
@app.get("/health")
def health():
    return {
        "status": "online",
        "modelo": "CLIRA Random Forest"
    }
