const User = require("../models/users");
// const {v4 : uuidv4}= require("uuid")
const {setUser}= require("../services/auth");
async function handleUserSignup(req, res){
    const {name, email, password, role} = req.body;
    const result = await User.findOne({email, password});
    if(!result){
        await User.create({
        name,
        email,
        password,
        role
        })
        return res.status(200).redirect("./login");
    }else{
        return res.redirect("./login");
    }
    
}
async function handleUserLogin(req, res){
    const {email, password} = req.body;
    const result = await User.findOne({email, password});
    if (!result){
        return res.status(404).redirect("/login");
    }else{
        const token = setUser(result);
        res.cookie("uid",token);
        return res.redirect("/");
    }
    // const sessionId = uuidv4();
    // setUser(sessionId, result);
    // res.cookie("uid",sessionId);
    }
module.exports = {
    handleUserSignup,
    handleUserLogin,
}