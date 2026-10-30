import joblib
from pathlib import Path

RUTA_MODELO = Path(__file__).parent / "modelo_clira.pkl"

artefacto = joblib.load(RUTA_MODELO)

print("Tipo de objeto:", type(artefacto))

if isinstance(artefacto, dict):
    print("Claves disponibles:", artefacto.keys())
else:
    print("El archivo contiene directamente el modelo.")