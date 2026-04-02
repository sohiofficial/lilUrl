const UrlDb = require("../models/url.js");
const Users = require("../models/users.js")
const redis = require("../redis.js");
const crypto = require("crypto");
const {setUser, getUser}= require("../services/auth.js");
const { nanoid }= require("nanoid");

const TTL_secs = 24*60*60;

async function handleCreateShortId(req, res){
    const cacheKey = (redirectUrl) => `redirectUrl:${crypto.createHash("md5").update(redirectUrl).digest("hex")}`;
    const {redirectUrl} = req.body;
    try{
        if(!redirectUrl){
            return res.status(400).json({err:"URL is required"});
        }
        const cached = await redis.get(cacheKey(redirectUrl));
        if(cached){
            return res.status(201).render("home",{shortId: cached});
        }
        const check = await UrlDb.findOne({redirectUrl});
        if(!check){
            const result = await UrlDb.create({
                shortId: nanoid(8),
                redirectUrl: redirectUrl,
                visitHistory:[]
            });
            await redis.setex(cacheKey(redirectUrl), TTL_secs, result.shortId);
            return res.status(201).render("home",{shortId : result.shortId});
        }else{
            const existingShortId = check.shortId;
            await redis.setex(cacheKey(redirectUrl), TTL_secs, existingShortId);
            return res.status(200).render("home", {shortId: existingShortId});
        }
    }catch(err){
        console.error("error message: ", err);
        return res.status(500).json({message: "server error"})
    }  
}


async function handleRedirectUrl(req, res){
    // get the main url using the short url from the database 
    // and open the page the redirect user indicates to
    const cacheKey = (shortId)=> `id:${shortId}`;
    const clickKey = (shortId)=> `clicks:${shortId}`;
    const shortId = req.params.shortId;
    try{
        const cached = await redis.get(cacheKey(shortId));
        if(cached){
            redis.incr(clickKey(shortId));
            return res.redirect(302, cached);
        }
        const result = await UrlDb.findOne({shortId});
        if(!result){
        return res.status(404).json({err:"no url found "})
        }
        await redis.setex(cacheKey(shortId),TTL_secs,result.redirectUrl);
        redis.incr(clickKey(shortId));
        return res.redirect(302, result.redirectUrl);
    }catch(err){
        console.error("error message: ", err);
        return res.status(500).json({message: "server error"});
    }  
}


async function handleViewHistory(req, res){
    const cacheVisitKey = (shortId)=> `visits:${shortId}`;
    const clickKey = (shortId)=> `clicks:${shortId}`;
    const shortId = req.query.shortId;

    const userToken = req.cookies?.uid;
    const user = getUser(userToken);
    const adminUserResult = await Users.find({});

    try{
        const liveClicks = await redis.get(clickKey(shortId));
        const cachedVisit = await redis.get(cacheVisitKey(shortId));
        if(cachedVisit){
            const totalClicks = cachedVisit + (parseInt(liveClicks))|| 0;
            return res.render("home",{result: result, userRole: user.role, adminUserResult: adminUserResult,totalClicks: totalClicks})
        }
        const result = await UrlDb.findOne({shortId});
        if(!result){
            return res.status(404).json({err:"no url found "})
        }
        await redis.setex(cacheVisitKey(shortId),TTL_secs,result.visitHistory);
        const totalClicks = result.visitHistory + (parseInt(liveClicks))|| 0;
        return res.render("home",{result: result, userRole: user.role, adminUserResult: adminUserResult,totalClicks: totalClicks});
    }catch(err){
        console.error("error message: ", err);
        return res.status(500).json({message: "server error"});
    }
}
module.exports={
    handleCreateShortId,
    handleRedirectUrl,
    handleViewHistory,
}