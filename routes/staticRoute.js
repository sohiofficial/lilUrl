const express = require("express");
const router = express.Router();
const {restrictTo}= require("../middlewares/auth.js");
router.get("/", restrictTo("ADMIN", "NORMAL"), (req, res)=>{
    res.render("home");
})
router.get("/signup",(req,res)=>{
    res.render("signup");
})
router.get("/login", (req,res)=>{
    res.render("login");
})
module.exports = router;