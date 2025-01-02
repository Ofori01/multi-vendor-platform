import { Router } from "express";
import communicator from "../../../communicator/index.mjs";
import authorization from "../auth/controllers/authController.mjs";
import multer from "multer";
import addProductController from "./controller/addProduct.mjs";
const productRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


productRouter.post('/product/add',authorization(['seller']) ,upload.single("image") ,addProductController)

productRouter.put('/product/update',authorization(['seller']) ,async (req,res)=>{
    const {product_id, product} = req.body;
    if(!product_id || !product){
        return res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const updatedProduct = await communicator.updateProduct(product_id, product);
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.delete('/product/delete',authorization(['seller', 'admin']) ,async (req,res)=>{
    const {product_id} = req.body;
    if(!product_id){
        res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const deletedProduct = await communicator.deleteProduct(product_id);
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/getAll',async (req,res)=>{
    const {category} = req.query;
    console.log(category)
    if(category){
        try {
            const products = await communicator.getProductsByCategory(category);
            return res.status(200).send(products);
        } catch (error) {
            return res.status(500).send({msg: `${error.message}`})
        }
    }

    
    else try {
        const products = await communicator.getProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/seller',authorization(['seller']),async (req,res)=>{
    try {
        const seller_id = req.user.userID
        const products = await communicator.getProductsBySeller(seller_id);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
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
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/image/:id', async (req,res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).send({msg: "Please provide image id"});
    }
    try {
        const image = await communicator.getProductImage(id);
        res.setHeader('Content-Type', 'image/jpeg')
        res.status(200).send(image);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/availableCategories', async (req,res)=>{
    try {
        console.log('Available categories route')
        const categories=  await communicator.getAvailableCategories()
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/allCategories', async (req,res)=>{
    try {
        const categories = await communicator.getAllCategories();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

export default productRouter




