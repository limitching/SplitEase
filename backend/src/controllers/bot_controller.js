import { bot } from "../services/line_connection.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { attachGroup } from "../models/group_model.js";
dotenv.config();
const { BASE_URL } = process.env;

import User from "../models/user_model.js";

function handleEvent(event) {
    // console.log("event", event);
    if (eventTypeHandlerMap[event.type]) {
        eventTypeHandlerMap[event.type](event);
    } else {
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}

const messageTypeHandlerMap = { text: handleText, image: handleImage };

async function handleText(message, replyToken, source) {
    console.log("message", message);
    console.log("event.replyToken", replyToken);
    console.log("source", source);

    if (message.text.startsWith("/bind") || message.text.startsWith("/綁定")) {
        return textMap.bind(message, replyToken, source);
    }
    if (
        message.text.startsWith("/attach") ||
        message.text.startsWith("/連接")
    ) {
        return textMap.attach(message, replyToken, source);
    }

    if (message.text.startsWith("/expense")) {
        return textMap.expense(message, replyToken, source);
    }

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

//===========================================

const textMap = {
    bind: handleBinding,
    attach: handleAttachment,
    expense: handleExpense,
};

async function handleBinding(message, replyToken, source) {
    const line_binding_code = message.text.split(" ")[1];
    if (line_binding_code === undefined) {
        const reply = {
            type: "text",
            text: "Example：(請自行替換)\n/綁定 [你的個人綁定碼] \n/bind [your binding code]",
        };

        return bot.replyMessage(replyToken, reply);
    }

    const binding = await User.bindingLineUser(line_binding_code, source);
    if (binding.result === -1) {
        const reply = {
            type: "text",
            text: "Error: Internal Server Error (MySQL).",
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (binding.result === 0) {
        const reply = {
            type: "text",
            text: "Error: Invalid binding code.",
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (binding.result === 1) {
        const { name } = binding;

        const reply = {
            type: "text",
            text: `User:${name} \nBinding successfully!`,
        };
        return bot.replyMessage(replyToken, reply);
    }
}

async function handleAttachment(message, replyToken, source) {
    // Make sure this operation within LINE groups
    if (!source.groupId) {
        const reply = {
            type: "text",
            text: "Invalid operation: \nCan only be operated within LINE groups",
        };
        return bot.replyMessage(replyToken, reply);
    }

    //Check if user is binding
    const user = await User.getBindingUser(source);
    if (user.result === 0) {
        const reply = {
            type: "text",
            text: `Invalid operation:\nPlease bind your LINE via binding code to unlock more features.\nExample:\n/bind [your binding code]`,
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (user.error || user.result === -1) {
        const reply = {
            type: "text",
            text: "Error: Internal Server Error (MySQL).",
        };
        return bot.replyMessage(replyToken, reply);
    }

    const invitation_code = message.text.split(" ")[1];
    if (invitation_code === undefined) {
        const reply = {
            type: "text",
            text: "Example: \n/attach [group invitation code]\n/連接 [你的群組邀請碼]",
        };

        return bot.replyMessage(replyToken, reply);
    }

    const attachment = await attachGroup(invitation_code, source);
    if (attachment.result === -1) {
        const reply = {
            type: "text",
            text: "Error: Internal Server Error (MySQL).",
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (attachment.result === 0) {
        const reply = {
            type: "text",
            text: "Error: Invalid invitation code.",
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (attachment.result === 1) {
        const { name } = attachment;
        const groupSummary = await bot.getGroupSummary(source.groupId);
        console.log(groupSummary);
        const reply = {
            type: "text",
            text: `Group:${name}\nLINE group: ${groupSummary.groupName}\nAttach successfully!`,
        };
        return bot.replyMessage(replyToken, reply);
    }
}

async function handleExpense(message, replyToken, source) {
    // Make sure this operation within LINE groups
    if (!source.groupId) {
        const reply = {
            type: "text",
            text: "Invalid operation: \nCan only be operated within LINE groups",
        };
        return bot.replyMessage(replyToken, reply);
    }
    // Check if user is binding
    const user = await User.getBindingUser(source);
    if (user.result === 0) {
        const reply = {
            type: "text",
            text: `Invalid operation:\nPlease bind your LINE via binding code to unlock more features.\nExample:\n/bind [your binding code]`,
        };
        return bot.replyMessage(replyToken, reply);
    }
    if (user.error || user.result === -1) {
        const reply = {
            type: "text",
            text: "Error: Internal Server Error (MySQL).",
        };
        return bot.replyMessage(replyToken, reply);
    }
    // Check if group is binding
}

//===========================================

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
