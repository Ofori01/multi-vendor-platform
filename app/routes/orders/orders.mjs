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
            // console.log(createdOrder.user_id)
            // const message = await communicator.sendNotification(req.user.userID,"Order Successfully Created",`Your order :${createdOrder.order_id} was successfully created at ${createdOrder.updatedAt}`)
            const message= await communicator.sendNotification(createdOrder.user_id, "Order Successfully Created",`Your order :${createdOrder.order_id} was successfully created at ${createdOrder.updated_at}`)
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
            return res.status(400).send({msg: 'Missing required fields'});
        }
        const order = await communicator.getOrder(id);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }

})

export default orderRouter