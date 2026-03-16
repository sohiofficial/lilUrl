const UrlDb = require("../models/url.js");
const { nanoid }= require("nanoid");

async function handleCreateShortId(req, res){
    // check whether the URL already exists or not in the front end and in the DB
    // create a shortId 
    // store it into db
    // return result 
    
    const redirectUrl = req.body.redirectUrl;
    if(!redirectUrl){
        return res.status(400).json({err:"URL is required"});
    }
    const check = await UrlDb.findOne({redirectUrl});

    if(!check){
        const result = await UrlDb.create({
        shortId: nanoid(8),
        redirectUrl: redirectUrl,
        visitHistory:[]
        });
        // return res.status(201).json({msg:`short ID created : ${result.shortId}`})
        return res.status(201).render("home",{shortId : result.shortId});
    }else{
        const existingShortId = check.shortId;
        // return res.status(200).json({msg:`short ID already exists : ${existingShortId}`})
        return res.status(200).render("home", {shortId: existingShortId});
    }
    
}


async function handleRedirectUrl(req, res){
    // get the main url using the short url from the database 
    // and open the page the redirect user indicates to
    const shortId = req.params.shortId;
    const result = await UrlDb.findOneAndUpdate({shortId},{$push: {visitHistory:{visistedAt:Date()}}});
    if(!result){
        return res.status(404).json({err:"no url found "})
    }
    return res.redirect(result.redirectUrl);
}


async function handleViewHistory(req, res){
    //get main url from short id 
    //calc the total visit by array length method 
    //return the total visits 
    const shortId = req.query.shortId;
    const result = await UrlDb.findOne({shortId});
    if(!result){
        return res.status(404).json({err:"no url found "})
    }
    return res.render("home",{result: result})
    // return res.json({msg:`total no. of visits = ${result.visitHistory.length}`})
}
module.exports={
    handleCreateShortId,
    handleRedirectUrl,
    handleViewHistory,
}