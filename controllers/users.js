const User = require("../models/users");
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
    if(!result){
        return res.redirect("/signup");
    }else{
        return res.redirect("/");
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}