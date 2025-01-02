import { Router } from "express";
import communicator from "../../../communicator/index.mjs";
import authorization from "../auth/controllers/authController.mjs";


const orderRouter = Router();

orderRouter.post('/order/create',authorization(['user']), async (req, res) => {
    try {
        const {items,total_price,shipping_address} = req.body;
        if(!items || !total_price || !shipping_address) {
            return res.status(400).send({msg: 'Missing required fields'});
        }
        const createdOrder  = await communicator.placeOrder({items,total_price,user_id: req.user.userID,shipping_address});
        if(createdOrder){
            //get product names
            let sellers= []
            let products = await Promise.all(
                createdOrder.items.map(
                        async ({product_id,quantity, price})=>{
                            const product =  await communicator.getProduct(product_id)
                            sellers.push({seller_id: product.seller_id, product_title: product.title, quantity,price})
                            return product.title
                        }
                    )
            ) 
            //send notification to user
    
            const message= await communicator.sendNotification(createdOrder.user_id, "Order Successfully Created",`Hello ${req.user.name},\n\nYour order:\n${createdOrder.order_id}\n${products.join('\n')}\nTotal price ${createdOrder.total_price}\nwas successfully created at ${createdOrder.updatedAt}\n\nMulti-Vendor-Platform Team`)

            //send notification to seller(s)
            await Promise.all(
                sellers.forEach(async ({seller_id,product_title,quantity, price})=> await communicator.sendNotification(seller_id,"Order Placed", `Hello,\n\nAn order for your product ${product_title} with price ${price} has been placed.\nThe order was placed for ${quantity} units of ${product_title}\n\nYou will be notified when the payment for the order is confirmed.\n\n Thank you,\nMulti-vendor-platform-team  `))
            ) 

        }
        res.status(201).send(createdOrder);

    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

orderRouter.put('/order/update',async (req, res) => {
    try {
        const {order_id, order} = req.body;
        if(!order_id || !order) {
            return res.status(400).send({msg: 'Missing required fields'});
        }
        const updatedOrder = await communicator.updateOrder(order_id, order);
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

orderRouter.patch('/order/cancel' ,async (req, res) => {
    try {
        const {order_id} = req.body;
        if(!order_id) {
            return res.status(400).send({msg: 'Order ID is required'});
        }
        const cancelledOrder = await communicator.cancelOrder(order_id);
        if(cancelledOrder){
            const message= communicator.sendNotification(cancelledOrder.user_id, "Order Cancelled",  `Your order :${createdOrder.order_id} was successfully cancelled at ${createdOrder.updated_at}`)
        }
        res.status(200).send(cancelledOrder);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

orderRouter.get('/order/getOrders',authorization(['user']) ,async (req, res) => {
    try {
        const user_id = req.user.userID;
        if(!user_id) {
            return res.status(400).send({msg: 'Missing required fields'});
        }
        const orders = await communicator.getOrders(user_id);
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

orderRouter.get('/order/getOrder/:id', async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).send({msg: 'Order ID is required'});
        }
        const order = await communicator.getOrder(id);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

export default orderRouter