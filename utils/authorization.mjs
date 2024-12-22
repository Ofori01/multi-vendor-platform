import communicator from '../communicator/index.mjs'

function verifyUserRole(token){
    try {
        const userDetails =  communicator.verifyToken(token)
        return userDetails.role
    } catch (error) {
        throw error
        
    }
}