import ProductModel from "../models/products/productsSchema.mjs";

async function addProduct(seller_id, title, description, price, stock_quantity, category){
    try {
        const newProduct = new ProductModel({seller_id, title, description, price, stock_quantity, category});
        return await newProduct.save();
    } catch (error) {
        throw error;
    }

}

async function updateProduct(product_id,product){
    try {
        const updatedProduct = await ProductModel.findOneAndUpdate({product_id},product,{new:true});
        console.log(updatedProduct);
        return updatedProduct
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(product_id){
    try {
        return await ProductModel.findOneAndDelete({product_id});
    } catch (error) {
        throw error;
    }
}

async function getProducts(){
    try {
        return await ProductModel.find();
    } catch (error) {
        throw error;
    }
}

async function getProduct(product_id){
    try {
        return await ProductModel.findOne({product_id});
    }
    catch (error) {
        throw error;
    }
}

export {addProduct,updateProduct,deleteProduct,getProducts,getProduct};