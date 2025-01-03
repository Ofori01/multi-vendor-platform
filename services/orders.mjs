import communicator from "../communicator/index.mjs";
import OrdersModel from "../models/orders/ordersSchema.mjs";



async function placeOrder(order){
 try {
    const newOrder = new OrdersModel(order);
    return await newOrder.save();
 } catch (error) {
    throw error
    
 }
}
async function updateProductsStock(order){ 
    try {
         Promise.all(order.items.map(async (item) => {
            const product = await communicator.getProduct(item.product_id);
            const updatedProduct = await communicator.updateProduct(product.product_id, {stock_quantity: product.stock_quantity - item.quantity});
            return updatedProduct;
        }))
    } catch (error) {
        throw error
        
    }
}

async function updateOrder(order_id,order){
    try {
        const updatedOrder = await OrdersModel.findOneAndUpdate({order_id}, order, {new: true});
        return updatedOrder;
    } catch (error) {
        throw error
        
    }
}





async function getOrders(user_id){
    try {
        const orders = await OrdersModel.find({user_id});
        console.log(orders)
        return orders;
    } catch (error) {
        throw error
        
    }
}

async function getOrder(order_id){
    try {
        const order = await OrdersModel.findOne({order_id});
        return order;
    } catch (error) {
        throw error
        
    }
}

async function getSellerOrders(seller_id){
    try {
        const orders = await OrdersModel.find({'items.seller_id': seller_id});
        return orders;
    } catch (error) {
        throw error
        
    }
}

async function updateUserOrders(user_id,order){
    try {
       const updatedOrders =  await OrdersModel.updateMany({user_id}, order);
       return updatedOrders;
    } catch (error) {
        throw error
    }
}

export {placeOrder, updateOrder, getOrders, getOrder, getSellerOrders, updateUserOrders,updateProductsStock};