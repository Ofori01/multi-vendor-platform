import communicator from "../../../../communicator/index.mjs";

function authorization(roles){
    return async (req,res,next)=>{
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userDetails = await communicator.verifyToken(token);
            console.log(userDetails)
            if(!roles.includes(userDetails.decoded.role)){
                return res.status(403).send({msg: "You are not authorized to access this resource"});
            }
            req.user = userDetails.decoded;
            next();
        } catch (error) {
            res.status(500).send({msg: `Error: ${error.message}`})
        }
}
}

export default authorization