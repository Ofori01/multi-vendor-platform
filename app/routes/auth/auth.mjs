import { Router } from "express";
import communicator from "../../../communicator/index.mjs";

const authRouter =  Router();


authRouter.post('/signin', async (req,res)=> {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).send('Missing fields');
    }
    try {
        const token = await communicator.signIn(email, password);
        res.status(200).send(token);
    } catch (error) {
        res.status(500).send({msg: `Server error: ${error}`});
        
    }
})

authRouter.post('/signup', async (req,res)=> {
    const { password, email, name, role} = req.body;
    if( !password || !email || !name){
        res.status(400).send('Missing fields');
    }
    try {
        const user = await communicator.signUp( password, email, name, role);
        if(!user) throw new Error("User not created");
        res.status(200).send({msg: "User created"});
        
    } catch (error) {
        res.status(500).send({msg: `Server error: ${error.message}`});
    }
})
export default authRouter
