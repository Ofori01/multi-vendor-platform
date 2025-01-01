import communicator from "../../../../communicator/index.mjs";

async function addProductController(req,res,next){
    const {seller_id, title, description, price, stock_quantity, category} = req.body;
    console.log(seller_id, title, description, price, stock_quantity, category);
    if(!seller_id || !title || !description || !price || !stock_quantity || !category){
        return res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const image = req.file;
        console.log(image);
        if(!image) return res.status(400).send({msg: "Please provide an image"});
        const newProduct = await communicator.addProduct(seller_id, title, description, price, stock_quantity, category,image);
        const message = await communicator.sendNotification(seller_id, "Product added successfully", `Hello ${req.user.name}, \n Your product ${title} has been added successfully to the inventory \n Thank you \n Multi-vendor-platform team`);
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
}

export default addProductController