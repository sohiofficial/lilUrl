const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{
        type: String,
        required: true,
        unique: true
    },
    redirectUrl:{
        type: String,
        required: true
    },
    visitHistory:[]
},{timestamps: true});

const UrlDb = mongoose.model("urlUsers", urlSchema);

module.exports = UrlDb;