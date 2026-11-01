from sentence_transformers import SentenceTransformer

modelo_embeddings = SentenceTransformer(
    "paraphrase-multilingual-MiniLM-L12-v2"
)

def generar_embedding(texto: str):
    embedding = modelo_embeddings.encode(texto)

    return embedding.tolist()