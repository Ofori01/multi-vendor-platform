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
        const createdOrder  = await communicator.placeOrder({items,total_price,shipping_address});
        if(createdOrder){
            const message = communicator.sendNotification(user_id,"Order Successfully Created",    `Your order :${createdOrder.order_id} was successfully created at ${createdOrder.updatedAt}`)
        }
        res.status(201).send({msg: 'Order created successfully'});

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
            return res.status(400).send({msg: 'Missing required fields'});
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

orderRouter.post('/order/getOrders',authorization(['admin']) ,async (req, res) => {
    try {
        const {user_id} = req.body;
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
        const {order_id} = req.params;
        if(!order_id) {
            return res.status(400).send({msg: 'Missing required fields'});
        }
        const order = await communicator.getOrder(order_id);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

export default orderRouter