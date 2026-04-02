const redis = require("../redis");
const UrlDb = require("../models/url.js");

async function syncCacheCountersToDb() {
    try{
        //dlt redis counters
        //set up pipeline
        //sync them with db using bulk operations
        const keys = await redis.keys("clicks:*");
        if (keys.length === 0)return;

        const pipeline = redis.pipeline();
        keys.forEach(key => pipeline.getdel(key));
        const results = await pipeline.exec();
        
        const bulkOps = keys.map((key,i) => {
            const shortId = key.replace("clicks:","");
            const count = parseInt(results[i][1]) || 0;

            return{
                updateOne: {
                    filter:{shortId},
                    update:{$inc:{visitHistory: count}}
                }
            }
        })
        if (bulkOps.length>0){
            UrlDb.bulkWrite(bulkOps);
        }
    }catch(err){
        console.error("sync error for syncing counters of cache and DB", err);
    }
}
module.exports = {
    syncCacheCountersToDb,
}