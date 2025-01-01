import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { addProduct, deleteProduct, getAllCategories, getAvailableCategories, getProduct, getProductByCategory, getProducts, updateProduct } from '../../services/products.mjs';
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

app.post('/api/addProduct',async (req, res) => {
    const {seller_id, title, description, price, stock_quantity, category,image} = req.body;
    try {
        console.log(image)
        const imageId = await uploadToGridFS(image) //upload Image to storage bucket
        const newProduct = await addProduct(seller_id, title, description, price, stock_quantity, category,imageId);
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
    
});

app.put('/api/updateProduct', async (req,res)=>{
    const {product_id, product} = req.body;
    
    try {
        const updatedProduct = await updateProduct(product_id, product);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

app.delete('/api/deleteProduct', async (req,res)=>{
    const {product_id} = req.body;
    try {
        const deletedProduct = await deleteProduct(product_id);
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

app.get('/api/getProducts', async (req,res)=>{
    try {
        const products = await getProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

app.get('/api/getProduct/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        const product = await getProduct(id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

app.get('/api/getProductImage/:id', async (request,response)=>{
    let {id} = request.params;

    try {
        id = new ObjectId(id);
        // const image  = await bucket.find({_id: id}).toArray()



        const downloadStream = bucket.openDownloadStream(id);

        downloadStream.on('error', (error) => {
            console.error('Error downloading file:', error);
            return response.status(500).send('Error downloading file');
        });

        // response.setHeader('Content-Type', contentType);
        // response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        downloadStream.pipe(response);
    } catch (error) {
        console.error('Error retrieving file:', error);
        response.status(500).send('Error retrieving file');

        
    }
})

app.get('/api/getProductsByCategory/:category', async (req,res)=>{
    try {
        const {category} = req.params;
        const products = await getProductByCategory(category);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})


app.get('/api/getAvailableCategories', async (req,res)=>{
    try {
        console.log('Getting available categories')
        const categories = await getAvailableCategories()
        res.status(200).send(categories)
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

app.get('/api/getAllCategories', async (req, res)=> {
    try {
        res.status(200).send(getAllCategories())
    } catch (error) {
        res.status(500).send(error.message)
        
    }
})