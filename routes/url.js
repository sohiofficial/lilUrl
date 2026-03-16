const express = require("express");
const {handleCreateShortId,handleViewHistory,handleRedirectUrl}= require("../controllers/url.js");
const router = express.Router();

router.post("/",handleCreateShortId);
router.get("/analytics",handleViewHistory);
router.get("/:shortId",handleRedirectUrl);


module.exports = router;