import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFile = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});