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
        throw error
    }
}

export {findUserByEmail, createUser}