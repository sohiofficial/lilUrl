const {getUser}= require("../services/auth");
async function allowLoggedIn(req, res, next){
    const userUid = req.cookies?.uid;
    console.log("msggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",userUid);
    if(!userUid){
        return res.redirect("/login");
    }
    const user = getUser(userUid);
    if (!user){
        return res.redirect("/login");
    }
    req.user = user;
    next();
}
async function checkLoggedIn(req, res, next){
    const userUid = req.cookies?.uid;
    console.log("..............................................................................",userUid);
    const user = getUser(userUid);
    req.user = user;
    next();
}
module.exports ={
    allowLoggedIn,
    checkLoggedIn
}