require("dotenv").config();
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL,
    {retry(times){
        if(times>10)return null;
        return Math.min(times*200,30000);
    }
})
redis.on("connect", ()=> console.log("redis connected"))
redis.on("error", (err)=> console.log("Redis error",err));

module.exports = redis;