import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../../services/products.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PRODUCTS_PORT;
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Product Service is running `);
});
mongoose.connect(process.env.MONGO_URI_PRODUCTS).then(
    () => {
        console.log("products service Connected to Database")
    }
).catch(
    (error) => {
        console.log("Error connecting product service to MongoDB",error)
    }
);

app.post('/api/addProduct', async (req, res) => {
    const {seller_id, title, description, price, stock_quantity, category} = req.body;
    try {
        const newProduct = await addProduct(seller_id, title, description, price, stock_quantity, category);
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