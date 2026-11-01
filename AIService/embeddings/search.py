from fastapi import APIRouter
from pydantic import BaseModel

from embeddings.model import generar_embedding

router = APIRouter()

class PreguntaPaciente(BaseModel):
    paciente_id: int
    pregunta: str

class EmbeddingRequest(BaseModel):
    text: str


@router.post("/ask")
def consultar_paciente(datos: PreguntaPaciente):

    embedding = generar_embedding(datos.pregunta)

    return {
        "success": True,
        "paciente_id": datos.paciente_id,
        "pregunta": datos.pregunta,
        "dimensiones": len(embedding)
    }


@router.post("/generate")
def generar_vector(datos: EmbeddingRequest):

    embedding = generar_embedding(datos.text)

    return {
        "success": True,
        "embedding": embedding.tolist()
            if hasattr(embedding, "tolist")
            else list(embedding)
    }