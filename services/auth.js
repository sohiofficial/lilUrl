// const userSessionId = new Map();
// function setUser(id, user){
//     userSessionId.set(id, user);
// }
// function getUser(id){
//     return userSessionId.get(id);
// }
// module.exports ={
//     setUser,
//     getUser,
// }
const jwt = require("jsonwebtoken");
const secret = "lalalalalalalalalalalalalala"
function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email
    },secret)
}
function getUser(token){
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}
 module.exports ={
    setUser,
    getUser,
}