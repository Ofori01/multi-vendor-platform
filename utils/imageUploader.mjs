import {Readable} from 'stream'
import { bucket } from '../microservices/products/index.mjs';

const uploadToGridFS = (file) => {
    return new Promise((resolve, reject) => {
        const readableFileStream = new Readable();
        readableFileStream.push(file.buffer);
        readableFileStream.push(null);

        const uploadStream = bucket.openUploadStream(file.originalname, {
            chunkSizeBytes: 1048576, 
            metadata: { field: 'uploadDate', value: `${Date.now()}` }
        });

        readableFileStream.pipe(uploadStream).on('error', (error) => {
            reject(error);
        }).on('finish', () => {
            resolve(uploadStream.id);
        });
    });
};

export default uploadToGridFS