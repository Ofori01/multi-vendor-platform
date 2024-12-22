import jsonwebtoken  from 'jsonwebtoken'
import bcrypt from 'bcrypt'
function generateToken(userID, name, role ) {
    try {
        let token = jsonwebtoken.sign({userID,name, role}, process.env.JWT_SECRET, {expiresIn: "1h"})
        return token
    } catch (error) {
        throw error
    }
}

function verifyToken(token){
    try {
        let decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (error) {
        throw error        
    }

}


function refreshToken(token){
    try {
        let decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            throw new Error("Invalid Token")
        }
        let newToken = jsonwebtoken.sign({userID: decoded.userID, name: decoded.name, role: decoded.role}, process.env.JWT_SECRET, {expiresIn: "1h"})
        return newToken
    } catch (error) {
        
    }
}


function generatePasswordHash(plainTextPassword){
    const saltRounds = 10;
    const hash = bcrypt.hashSync(plainTextPassword, saltRounds)
    return hash
}

function comparePasswords(plainTextPassword, hash){
    return bcrypt.compareSync(plainTextPassword, hash)
}




export {generateToken, verifyToken, refreshToken, generatePasswordHash, comparePasswords}