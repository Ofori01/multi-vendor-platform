import ProductModel from "../models/products/productsSchema.mjs";

async function addProduct(seller_id, title, description, price, stock_quantity, category,imageId){
    try {
        const newProduct = new ProductModel({seller_id, title, description, price, stock_quantity, category, image_url: imageId});
        return await newProduct.save();
    } catch (error) {
        throw error;
    }

}

async function updateProduct(product_id,product){
    try {
        const updatedProduct = await ProductModel.findOneAndUpdate({product_id},product,{new:true});
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

async function getProductByCategory(category){
    try {
        return await ProductModel.find({category});
    } catch (error) {
        throw error;
    }
}

async function getAvailableCategories(){
    try {
        let categories = ProductModel.find(_,{category:1})
        console.log(categories)
        categories = [...new Set(categories.map((product)=> product.category))]
        console.log(categories)
        return categories

    } catch (error) {
        throw error
        
    }
}

function getAllCategories(){
        return  ["Electronics", "Clothing", "Books", "Home & Kitchen", "Beauty & Health", "Sports & Outdoors", "Toys & Games", "Others"]
}

export {addProduct,updateProduct,deleteProduct,getProducts,getProduct,getProductByCategory, getAvailableCategories, getAllCategories};