import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const filter = ( req, file, cb ) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only jpeg, png, and webp images are allowed"));
    }
};

export const upload = multer({ storage, fileFilter: filter });