import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';

// Функция для создания путей с прямыми слешами
const normalizePath = (...segments: string[]): string => {
    return segments.join('/').replace(/\\/g, '/');
};

export const multerOptions = {
    storage: diskStorage({
        destination: './uploads/articles',
        filename: (req, file, callback) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueName);
        },
    }),
    fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed'), false);
        }
    },
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
    async transform(req, file, callback) {
        try {
            const tempPath = normalizePath(process.cwd(), 'uploads', 'articles', file.filename);
            const compressedPath = normalizePath(process.cwd(), 'Uploads', 'articles', `compressed-${file.filename}`);

            // Сжимаем изображение с помощью Sharp
            await sharp(tempPath)
                .jpeg({ quality: 80 })
                .png({ compressionLevel: 8 })
                .toFile(compressedPath);

            // Заменяем оригинальный файл сжатым
            await fs.rename(compressedPath, tempPath);

            // Сохраняем нормализованный путь в file.path
            file.path = normalizePath('uploads', 'articles', file.filename);
            callback(null, file);
        } catch (error) {
            callback(error);
        }
    },
};