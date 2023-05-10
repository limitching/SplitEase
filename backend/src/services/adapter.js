import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });

let tls;
if (process.env.NODE_ENV === "production") {
    tls = {};
}

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: function (times) {
        if (times < 3) {
            return 100;
        } else {
            return 5000;
        }
    },
    tls,
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

function initializePubSub() {
    const redisPub = redis.duplicate();
    const redisSub = redis.duplicate();

    redisPub.on("ready", () => {
        console.log("redisPub is ready");
    });
    redisSub.on("ready", () => {
        console.log("redisSub is ready");
    });

    redisPub.on("error", (err) => {
        console.error(err);
    });
    redisSub.on("error", (err) => {
        console.error(err);
    });

    return {
        redisPub: redisPub,
        redisSub: redisSub,
    };
}

export {  initializePubSub };
