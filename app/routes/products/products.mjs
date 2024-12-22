import { Router } from "express";
import communicator from "../../../communicator/index.mjs";
import authorization from "../auth/controllers/authController.mjs";

const productRouter = Router();


productRouter.post('/product/add',authorization ,async (req,res)=>{
    const {seller_id, title, description, price, stock_quantity, category} = req.body;
    if(!seller_id || !title || !description || !price || !stock_quantity || !category){
        return res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const newProduct = await communicator.addProduct(seller_id, title, description, price, stock_quantity, category);
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }

})

productRouter.put('/product/update', async (req,res)=>{
    const {product_id, product} = req.body;
    if(!product_id || !product){
        return res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const updatedProduct = await communicator.updateProduct(product_id, product);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

productRouter.delete('/product/delete', async (req,res)=>{
    const {product_id} = req.body;
    if(!product_id){
        res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const deletedProduct = await communicator.deleteProduct(product_id);
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

productRouter.get('/product/getAll', async (req,res)=>{
    try {
        const products = await communicator.getProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

productRouter.get('/product/get/:id', async (req,res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).send({msg: "Please provide product id"});
    }
    try {
        const product = await communicator.getProduct(id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
})

export default productRouter




