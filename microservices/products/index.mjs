import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../../services/products.mjs';
import multer from 'multer';
import uploadToGridFS from '../../utils/imageUploader.mjs';
dotenv.config();

const app = express();
const PORT = process.env.PRODUCTS_PORT;
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Product Service is running `);
});
mongoose.connect(process.env.MONGO_URI_PRODUCTS)
const db_connection = mongoose.connection;

//Initialize Grid Bucket
let bucket;

db_connection.on('error', (error) => {
    console.error('Database connection error:', error);
  });

db_connection.once('open',  () => {
    console.log('Database connected');
    bucket = new GridFSBucket(db_connection.db, { bucketName: 'uploads' });
});

export {bucket}
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/addProduct',upload.fields([{name:"image", maxCount:1}]) ,async (req, res) => {
    const {seller_id, title, description, price, stock_quantity, category,image} = req.body;
    try {
        const imageId = await uploadToGridFS(image)
        const newProduct = await addProduct(seller_id, title, description, price, stock_quantity, category,imageId);
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
    
});

app.put('/api/updateProduct', async (req,res)=>{
    const {product_id, product} = req.body;
    
    try {
        const updatedProduct = await updateProduct(product_id, product);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

app.delete('/api/deleteProduct', async (req,res)=>{
    const {product_id} = req.body;
    try {
        const deletedProduct = await deleteProduct(product_id);
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

app.get('/api/getProducts', async (req,res)=>{
    try {
        const products = await getProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

app.get('/api/getProduct/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await getProduct(id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})