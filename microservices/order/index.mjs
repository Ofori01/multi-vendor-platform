import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { getOrder, getOrders, getSellerOrders, placeOrder, updateOrder } from '../../services/orders.mjs';

dotenv.config();

const app = express();
const PORT = process.env.ORDERS_PORT;


app.listen(PORT, () => {
    console.log(`Order Service is running`);
});
mongoose.connect(process.env.MONGO_URI_ORDERS).then(
    () => {
        console.log("Orders service Connected to Database")
    }
).catch(
    (error) => {
        console.log("Error connecting order service to MongoDB",error)
    }
);

app.use(express.json());


app.post('/api/placeOrder', async (req, res) => {
    try {
        const {order}  = req.body;
        const newOrder = await placeOrder(order);

        res.status(201).send(newOrder);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        console.log(error)
        
    }
})

app.put('/api/updateOrder', async (req, res) => {
    try {
        const {order_id, order}  = req.body;
        const updatedOrder = await updateOrder(order_id,order);
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
    }

})

app.patch('/api/cancelOrder', async (req, res) => {
    try {
        const {order_id}  = req.body;
        const cancelledOrder = await updateOrder(order_id, {order_status: "Cancelled"});
        res.status(200).send(cancelledOrder);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
    }

})

app.post('/api/getUserOrders', async (req, res) => {
    try {
        const {user_id}  = req.body;
        const orders = await getOrders(user_id);
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
    }

})

app.get('/api/getOrder/:id', async (req, res) => {
    try {
        const {order_id}  = req.body;
        const order = await getOrder(order_id);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
    }

})

app.get('/api/getOrdersBySeller/:seller_id', async (req, res) => {
    try {
        const {seller_id}  = req.params;
        const orders = await getSellerOrders(seller_id);
        return res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`});
        
    }
})