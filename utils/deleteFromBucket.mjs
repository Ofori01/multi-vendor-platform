import { bucket } from "../microservices/products/index.mjs";
import mongoose from "mongoose";

const deleteFromGridFS = (fileId) => {
    const objectId = new mongoose.Types.ObjectId(fileId);
    return new Promise((resolve, reject) => {
        bucket.delete(objectId, (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
};

export default deleteFromGridFS