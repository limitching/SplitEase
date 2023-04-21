import { client } from "../services/line_connection.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const { BASE_URL } = process.env;

function handleEvent(event) {
    if (event.type === "message") {
        const message = event.message;

        console.log(message, event.replyToken, event.source);

        if (handleEventMap[message.type]) {
            handleEventMap[message.type](
                message,
                event.replyToken,
                event.source
            );
        } else {
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }
    } else {
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}

function handleText(message, replyToken, source) {
    switch (message.text) {
        case "測試1":
            return client.replyMessage(replyToken, [
                {
                    type: "sticker",
                    packageId: "1",
                    stickerId: "1",
                },
            ]);

        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            const echo = {
                type: "text",
                text: message.text,
            };
            return client.replyMessage(replyToken, echo);
    }
}

function handleImage(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
        const downloadPath = path.join(
            process.cwd(),
            "public",
            "downloaded",
            `${message.id}.jpg`
        );

        getContent = downloadContent(message.id, downloadPath).then(
            (downloadPath) => {
                return {
                    originalContentUrl:
                        BASE_URL + "/downloaded/" + path.basename(downloadPath),
                    previewImageUrl:
                        BASE_URL + "/downloaded/" + path.basename(downloadPath),
                };
            }
        );
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }

    return getContent.then(({ originalContentUrl, previewImageUrl }) => {
        return client.replyMessage(replyToken, {
            type: "image",
            originalContentUrl,
            previewImageUrl,
        });
    });
}

function downloadContent(messageId, downloadPath) {
    return client.getMessageContent(messageId).then(
        (stream) =>
            new Promise((resolve, reject) => {
                const writable = fs.createWriteStream(downloadPath);
                stream.pipe(writable);

                stream.on("end", () => resolve(downloadPath));
                stream.on("error", reject);
            })
    );
}

const handleEventMap = { text: handleText, image: handleImage };

export { handleEvent };
