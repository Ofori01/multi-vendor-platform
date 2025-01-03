import usersModel from "../models/users/usersSchema.mjs";
async function findUserByEmail(email) {
    try {
        const user  = await usersModel.findOne({email})
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        throw error
    }
}

async function createUser(password, email, name, role) {
    try {
        const newUser = new usersModel({ password, email, name, role});
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error("User not created. Email already Exist or invalid fields");
        
    }
}

async function updateUser(user_id, user) {
    try {
        console.log(user_id, user)
        const updatedUser = await usersModel.findOneAndUpdate({user_id}, user, {new: true});
        if(!updatedUser) throw new Error("User not found");
        return updatedUser;
    }
    catch (error) {
        throw error
    }
}


async function deleteUser(user_id) {
    try {        
        const deletedUser = await usersModel.findOneAndDelete({user_id});
        if(!deletedUser) throw new Error("User not found");
        return deletedUser;
    } catch (error) {
        throw error
    }
}

export {findUserByEmail, createUser,updateUser,deleteUser}