import usersModel from "../models/users/usersSchema.mjs";


async function getUser(userID){
    try {
        let user =  await usersModel.findOne({user_id: userID})
        if(!user) throw new Error("User not Found");
        return user
        
    } catch (error) {
        throw Error
        
    }
}

async function getUsers(){
    try {
        let users = await usersModel.find()
        if(!users) throw new Error("Users not found");
        return users
    } catch (error) {
        throw error
        
    }
}

export {getUser,getUsers}