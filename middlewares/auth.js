const {getUser}= require("../services/auth");
async function allowLoggedIn(req, res, next){
    const userUid = req.cookies?.uid;
    console.log("ALLOWloggedin",userUid);
    if(!userUid){
        return res.redirect("/login");
    }
    const user = getUser(userUid);
    console.log("user",user);
    if (!user){
        return res.redirect("/login");
    }
    req.user = user;
    next();
}
async function checkLoggedIn(req, res, next){
    const userUid = req.cookies?.uid;
    console.log("CHECKloggedin",userUid);
    const user = getUser(userUid);
    console.log("CHECKuser",user);
    req.user = user;
    next();
}
module.exports ={
    allowLoggedIn,
    checkLoggedIn
}