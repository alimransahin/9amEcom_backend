import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folderName: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(
                process.cwd(),
                "uploads",
                folderName
            );

            // Create folder if it doesn't exist
            fs.mkdirSync(uploadPath, { recursive: true });

            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);

            const uniqueName = `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${ext}`;

            cb(null, uniqueName);
        },
    });
};

export const uploadFile = (folderName: string) =>
    multer({
        storage: createStorage(folderName),

        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith("image/")) {
                return cb(new Error("Only image files are allowed"));
            }

            cb(null, true);
        },

        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB
        },
    });