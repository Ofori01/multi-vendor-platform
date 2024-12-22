

async function authorization(req,res,next){
try {
    console.log('Authorization middleware');
    const token = req.headers.authorization.split(' ')[1];
    const userDetails = await communicator.verifyToken(token);
    console.log(userDetails);
    next();
} catch (error) {
    
}
}

export default authorization