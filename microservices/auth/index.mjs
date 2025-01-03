import dotenv from 'dotenv';
import express from 'express';
import mongoose, { mongo } from 'mongoose';
import { comparePasswords, generatePasswordHash, generateToken, refreshToken, verifyToken } from '../../utils/authentication.mjs';
import { createUser, deleteUser, findUserByEmail, updateUser } from '../../services/users.mjs';
import { getUser, getUsers } from '../../utils/users.mjs';
import communicator from '../../communicator/index.mjs';

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT;


app.listen(PORT, () => {
    console.log(`Auth Service is running`);
});
mongoose.connect(process.env.MONGO_URI_USERS).then(
    () => {
        console.log("Auth Connected to Database")
    }
).catch(
    (error) => {
        console.log("Error connecting auth service to MongoDB",error)
    }
);

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send("Auth Service is running");
});

app.post('/api/signin', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await findUserByEmail(email);
        if(!user) res.status(404).send("User not found");
        if(!comparePasswords(password, user.password)){ 
            return res.status(401).send("Invalid password");
        }
        const token = generateToken(user.user_id, user.name, user.role);
        res.status(200).send({token, user_id: user.user_id, name: user.name, role: user.role});

    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }

})

app.post('/api/signup', async (req, res)=>{
    let {password, email, name, role} = req.body;
    password= generatePasswordHash(password);
    try {
        const newUser = await createUser(password, email, name, role);
        res.status(200).send(newUser);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
    }

})


app.post('/api/refreshToken', async (req,res)=> {
    try {
        const {token} = req.body
        const newToken = refreshToken(token);
        res.status(200).send({token: newToken})
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
    }
})

app.post('/api/verifyToken', async (req,res)=> {
    try {
        const {token} = req.body;
        const decoded = verifyToken(token);
        res.status(200).send({decoded})
    } catch (error) {
        res.status(401).send({msg: `Token is invalid: ${error.message}`})
    }
})

app.get('/api/getUsers', async (req,res)=> {  
    try {
        const users = await getUsers()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
    }
 })

 app.get('/api/getUser/:id', async (req,res)=>{
    const {id} = req.params;
    console.log(id)
    try {
        const user = await getUser(id)
        res.status(200).send(user)
        
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
 })

 app.put('/api/updateUser', async (req,res)=>{
    const {user_id, user} = req.body;
    try {
        if (user.password) {
            user.password = generatePasswordHash(user.password);
        }
        const updatedUser = await updateUser(user_id, user);
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
 })

 app.delete('/api/deleteUser', async (req,res)=>{
    const {user_id, role} = req.body;
    try {
        if(role === 'user'){
            const deletedUser = await deleteUser(user_id);
            const message = await communicator.sendNotification(user_id, "Account Deleted",  `Hello, \n\nYour account was successfully deleted\n\nIf this wasn't you, please contact us immediately.\n\nBest regards,\nThe Multi-Vendor-Platform Team`);
            await communicator.updateUserOrders(user_id, {order_status: "Cancelled"});
            res.status(200).send(deletedUser);
        }
        else if(role === 'seller'){
            const deletedUser = await deleteUser(user_id);
            const message = await communicator.sendNotification(user_id, "Account Deleted",  `Hello, \n\nYour account was successfully deleted\n\nIf this wasn't you, please contact us immediately.\n\nBest regards,\nThe Multi-Vendor-Platform Team`);
            await communicator.deleteSellersProducts(user_id);

        }
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
    }
 })