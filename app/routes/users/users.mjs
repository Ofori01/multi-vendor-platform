import { Router } from "express";
import communicator from "../../../communicator/index.mjs";



const userRouter = Router();


userRouter.get('/users', async (req,res)=> {
    try {
        const users = await communicator.getUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({msg: `Internal Server Error: ${error.message}`})
    }
})

userRouter.get('/user/:id', async (req,res)=> {
    const {id} = req.params;
    if(!id) res.status(400).send('Missing fields'); 
    try {
        const user = await communicator.getUser(id);
        res.status(200).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: `Internal Server Error: ${error.message}`})
    }
})

export default userRouter