import sharp from "sharp"

//Esta funcion toma una imagen como un array de bufer
export const compressImage = async( image: Buffer<ArrayBufferLike> ) => {
    //Redimensionamos la imagen y ademas cambiamos la extension a webp la cual tiene menor peso y la convertimos a buffer
    const compresedImage = await sharp( image ).resize( { width: 1200 } ).webp( { quality: 80 } ).toBuffer();
    return compresedImage;
}