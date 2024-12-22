import OrdersModel from "../models/orders/ordersSchema.mjs";



async function placeOrder(order){
 try {
    const newOrder = new OrdersModel(order);
    return await newOrder.save();
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


export {placeOrder, updateOrder, getOrders, getOrder};