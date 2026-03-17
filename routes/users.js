const express = require("express");
const router = express.Router();
const {handleUserSignup, handleUserLogin}= require("../controllers/users");

router.post("/",handleUserSignup);
router.post("/login",handleUserLogin);

module.exports = router;