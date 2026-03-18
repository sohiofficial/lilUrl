const User = require("../models/users");
const {v4 : uuidv4}= require("uuid")
const {setUser, getUser}= require("../services/auth");
async function handleUserSignup(req, res){
    const {name, email, password} = req.body;
    const result = await User.findOne({email, password});
    if(!result){
        await User.create({
        name,
        email,
        password,
        })
        return res.status(200).redirect("./login");
    }else{
        return res.redirect("./login");
    }
    
}
async function handleUserLogin(req, res){
    const {email, password} = req.body;
    const result = await User.findOne({email, password});
    const sessionId = uuidv4();
    setUser(sessionId, result);
    res.cookie("uid",sessionId);
    console.log("lalalakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",req.cookies.uid);
    if(!req.cookies?.uid){
        return res.redirect("/login");
    }else{
        return res.redirect("/");
    }
    }
    
module.exports = {
    handleUserSignup,
    handleUserLogin,
}