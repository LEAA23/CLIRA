export const formatEmbedding = (embedding: number[]): string => {
    if (embedding.length !== 384) {
        throw new Error("El embedding debe tener 384 dimensiones");
    }

    return `[${embedding.join(",")}]`;
};