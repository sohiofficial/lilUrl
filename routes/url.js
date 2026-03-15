const express = require("express");
const {handleCreateShortId,handleViewHistory,handleRedirectUrl}= require("../controllers/url.js");
const router = express.Router();

router.post("/",handleCreateShortId);
router.get("/:shortId",handleRedirectUrl)
router.get("/analytics/:shortId",handleViewHistory);

module.exports = router;