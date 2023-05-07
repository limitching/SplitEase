import line from "@line/bot-sdk";
import dotenv from "dotenv";
dotenv.config();

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// create LINE SDK client
const bot = new line.Client(config);

const lineMiddleware = line.middleware(config);

export { bot, lineMiddleware };
