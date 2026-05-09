import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folderName: string) => {
    const uploadPath = path.join(process.cwd(), `uploads/${folderName}`);

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
            // get file extension
            const ext = path.extname(file.originalname);

            // unique file name
            const uniqueName = `${Date.now()}${ext}`;

            cb(null, uniqueName);
        },
    });
};

// reusable function
export const uploadFile = (folderName: string) =>
    multer({
        storage: createStorage(folderName),

        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith("image")) {
                return cb(new Error("Only images allowed"));
            }

            cb(null, true);
        },

        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    });