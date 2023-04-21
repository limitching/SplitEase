import { bot } from "../services/line_connection.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const { BASE_URL } = process.env;

function handleEvent(event) {
    if (eventTypeHandlerMap[event.type]) {
        eventTypeHandlerMap[event.type](event);
    } else {
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}

const messageTypeHandlerMap = { text: handleText, image: handleImage };

function handleText(message, replyToken, source) {
    switch (message.text) {
        case "測試1":
            return bot.replyMessage(replyToken, [
                {
                    type: "sticker",
                    packageId: "1",
                    stickerId: "1",
                },
            ]);
        case "Menu":
            return bot.replyMessage(replyToken, {
                type: "text",
                text: "Quick reply sample ?",
                quickReply: {
                    items: [
                        {
                            type: "action",
                            action: {
                                type: "postback",
                                label: "ithome Clarence 鐵人賽",
                                data: "action=url&item=clarence",
                                text: "ithome Clarence 鐵人賽",
                            },
                        },
                        {
                            type: "action",
                            action: {
                                type: "message",
                                label: "ithome Clarence",
                                text: "https://ithelp.ithome.com.tw/users/20117701",
                            },
                        },
                        {
                            type: "action",
                            action: {
                                type: "camera",
                                label: "Send camera",
                            },
                        },
                        {
                            type: "action",
                            action: {
                                type: "cameraRoll",
                                label: "Send camera roll",
                            },
                        },
                        {
                            type: "action",
                            action: {
                                type: "location",
                                label: "Send location",
                            },
                        },
                    ],
                },
            });
        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            const echo = {
                type: "text",
                text: message.text,
            };
            return bot.replyMessage(replyToken, echo);
    }
}

async function handleImage(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
        const downloadPath = path.join(
            process.cwd(),
            "public",
            "downloaded",
            `${message.id}.jpg`
        );

        try {
            const downloadResult = await downloadContent(
                message.id,
                downloadPath
            );
            const originalContentUrl =
                BASE_URL + "/downloaded/" + path.basename(downloadResult);
            const previewImageUrl =
                BASE_URL + "/downloaded/" + path.basename(downloadResult);
            getContent = Promise.resolve({
                originalContentUrl,
                previewImageUrl,
            });
        } catch (error) {
            console.error(error);
            return;
        }
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }

    try {
        const { originalContentUrl, previewImageUrl } = await getContent;
        return await bot.replyMessage(replyToken, {
            type: "image",
            originalContentUrl,
            previewImageUrl,
        });
    } catch (error) {
        console.error(error);
    }
}

async function downloadContent(messageId, downloadPath) {
    try {
        const stream = await bot.getMessageContent(messageId);
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        await new Promise((resolve, reject) => {
            stream.on("end", () => resolve(downloadPath));
            stream.on("error", reject);
        });
        return downloadPath;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const eventTypeHandlerMap = {
    message: handleMessageEvent,
    follow: handleFollowEvent,
    unfollow: handleUnFollowEvent,
    join: handleJoinEvent,
    leave: handleLeaveEvent,
    memberJoined: handleMemberJoined,
    memberLeft: handleMemberLeft,
};

function handleMessageEvent(event) {
    const message = event.message;

    console.log(message, event.replyToken, event.source);

    if (messageTypeHandlerMap[message.type]) {
        messageTypeHandlerMap[message.type](
            message,
            event.replyToken,
            event.source
        );
    } else {
        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
    }
}

function handleFollowEvent(event) {
    console.log(`Followed this bot: ${JSON.stringify(event)}`);
    return bot.replyMessage(event.replyToken, {
        type: "text",
        text: "Got followed event",
    });
}

function handleUnFollowEvent(event) {
    return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
}

function handleJoinEvent(event) {
    console.log(`Joined: ${JSON.stringify(event)}`);
    return bot.replyMessage(event.replyToken, {
        type: "text",
        text: `Joined ${event.source.type}`,
    });
}

function handleLeaveEvent(event) {
    return console.log(`Left: ${JSON.stringify(event)}`);
}
function handleMemberJoined(event) {
    console.log(`MemberJoined: ${JSON.stringify(event)}`);
    return bot.replyMessage(event.replyToken, {
        type: "text",
        text: `MemberJoined ${event.source.type}`,
    });
}

function handleMemberLeft(event) {
    console.log(`MemberLeft: ${JSON.stringify(event)}`);
    return bot.replyMessage(event.replyToken, {
        type: "text",
        text: `MemberLeft ${event.source.type}`,
    });
}

export { handleEvent };
