const {getUser}= require("../services/auth");

function checkLoggedIn(req, res, next){
    const userToken = req.cookies?.uid;
    const user = getUser(userToken);
    req.user = user;
    next();
}
function restrictTo(...roles){
    return (req, res, next)=>{
        const userToken = req.cookies?.uid;
        // console.log("userToken",userToken);
        const user = getUser(userToken)
        // console.log("user",user);
        if(!userToken || !user){
            return res.redirect("/login");
        }
        // console.log("userRolle",user.role);
        if(!roles.includes(user.role)){
            return res.status(401).end("unauthorized");
        }
        req.user = user;
        next();
    }
}

module.exports ={
    restrictTo,
    checkLoggedIn
}