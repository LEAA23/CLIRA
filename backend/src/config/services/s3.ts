import { S3Client } from "@aws-sdk/client-s3";

//Creamos un cliente para el servicio de s3 de AWS

/**
 * Especificamos la region del bucket, el accessKeyId y el secretAccessKey del usuario que hemos creado en AWS mediante el servicio de IAM
 */
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});