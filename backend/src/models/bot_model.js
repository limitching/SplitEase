import { AWS_CLOUDFRONT_HOST } from "../utils/constant.js";

const generateDebtNotify = (debtorName, creditorName, currency, amount) => {
    const body = {
        type: "bubble",
        hero: {
            type: "box",
            layout: "horizontal",
            contents: [
                {
                    type: "image",
                    url: "https://dxkgfgg79h3hz.cloudfront.net/line_notification/Transfer_money.png",
                    size: "full",
                    aspectMode: "cover",
                    gravity: "bottom",
                    flex: 1,
                    offsetTop: "none",
                    align: "end",
                    position: "relative",
                    animated: true,
                },
            ],
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            contents: [
                                {
                                    type: "span",
                                    text: "SplitEase remind you to pay the bill 💸",
                                    weight: "regular",
                                    color: "#000000",
                                },
                            ],
                            size: "sm",
                            text: "1",
                        },
                    ],
                    paddingAll: "20px",
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "image",
                                    url: "https://dxkgfgg79h3hz.cloudfront.net/avatars/tiger_avatar.jpg",
                                    aspectMode: "cover",
                                    size: "full",
                                    align: "center",
                                },
                            ],
                            cornerRadius: "100px",
                            width: "72px",
                            height: "72px",
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    contents: [
                                        {
                                            type: "span",
                                            text: debtorName,
                                            weight: "bold",
                                            color: "#000000",
                                            size: "lg",
                                        },
                                        {
                                            type: "span",
                                            text: "     ",
                                        },
                                    ],
                                    size: "sm",
                                    wrap: true,
                                },
                                {
                                    type: "text",
                                    contents: [
                                        {
                                            type: "span",
                                            text: "Debtor",
                                            weight: "regular",
                                            color: "#000000",
                                        },
                                        {
                                            type: "span",
                                            text: "     ",
                                        },
                                    ],
                                    size: "sm",
                                    wrap: true,
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "need to pay",
                                            size: "sm",
                                            color: "#bcbcbc",
                                        },
                                        {
                                            type: "text",
                                            text: `${currency} ${amount}`,
                                            size: "md",
                                            color: "#171970",
                                            weight: "bold",
                                        },
                                    ],
                                    spacing: "sm",
                                    margin: "md",
                                },
                            ],
                        },
                    ],
                    spacing: "xl",
                    paddingAll: "20px",
                    paddingTop: "0px",
                    paddingBottom: "10px",
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            contents: [
                                {
                                    type: "span",
                                    text: "↓",
                                    weight: "regular",
                                    color: "#000000",
                                    size: "xxl",
                                },
                            ],
                            size: "sm",
                            text: "1",
                            align: "center",
                        },
                    ],
                    paddingAll: "0px",
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "image",
                                    url: "https://dxkgfgg79h3hz.cloudfront.net/avatars/rabbit_avatar.jpg",
                                    aspectMode: "cover",
                                    size: "full",
                                },
                            ],
                            cornerRadius: "100px",
                            width: "72px",
                            height: "72px",
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    contents: [
                                        {
                                            type: "span",
                                            text: creditorName,
                                            weight: "bold",
                                            color: "#000000",
                                            size: "lg",
                                        },
                                        {
                                            type: "span",
                                            text: "     ",
                                        },
                                    ],
                                    size: "sm",
                                    wrap: true,
                                },
                                {
                                    type: "text",
                                    contents: [
                                        {
                                            type: "span",
                                            text: "Creditor",
                                            weight: "regular",
                                            color: "#000000",
                                        },
                                        {
                                            type: "span",
                                            text: "     ",
                                        },
                                    ],
                                    size: "sm",
                                    text: "1",
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "will receive",
                                            size: "sm",
                                            color: "#bcbcbc",
                                        },
                                        {
                                            type: "text",
                                            text: `${currency} ${amount}`,
                                            size: "md",
                                            color: "#171970",
                                            weight: "bold",
                                        },
                                    ],
                                    spacing: "sm",
                                    margin: "md",
                                },
                            ],
                        },
                    ],
                    spacing: "xl",
                    paddingAll: "20px",
                },
            ],
            paddingAll: "0px",
        },
        styles: {
            footer: {
                separator: false,
            },
        },
    };

    return body;
};

const generateGroupsMenu = async (groups) => {
    const body = {
        type: "carousel",
        contents: groups.map((group) => {
            const defaultDescription = "No description available.";
            const content = {
                type: "bubble",
                hero: {
                    type: "image",
                    size: "full",
                    aspectRatio: "20:13",
                    aspectMode: "cover",
                    url:
                        group.image ||
                        `${AWS_CLOUDFRONT_HOST}group_image_default/${Math.ceil(
                            Math.random() * 30
                        )}.jpg`,
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    contents: [
                        {
                            type: "text",
                            text: group.name,
                            wrap: true,
                            weight: "bold",
                            size: "xl",
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            contents: [
                                {
                                    type: "text",
                                    text:
                                        group.description || defaultDescription,
                                    wrap: true,
                                    weight: "bold",
                                    size: "xl",
                                    flex: 0,
                                },
                            ],
                        },
                    ],
                },
                footer: {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    contents: [
                        {
                            type: "button",
                            style: "primary",
                            action: {
                                type: "postback",
                                label: "Group Overview",
                                data: JSON.stringify({
                                    action: "accessGroup",
                                    group_id: group.id,
                                }),
                            },
                        },
                        {
                            type: "button",
                            action: {
                                type: "uri",
                                label: "Group Page",
                                uri: `https://splitease.cc/group/${group.slug}/overview`,
                            },
                        },
                    ],
                },
            };
            return content;
        }),
    };
    return body;
};

const generateGroupOverView = () => {
    const body = {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "GROUP OVERVIEW",
                    weight: "bold",
                    color: "#1DB446",
                    size: "sm",
                },
                {
                    type: "text",
                    text: "{{group name}}",
                    weight: "bold",
                    size: "xxl",
                    margin: "md",
                },
                {
                    type: "text",
                    text: "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                    size: "xs",
                    color: "#aaaaaa",
                    wrap: true,
                },
                {
                    type: "separator",
                    margin: "xxl",
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "xxl",
                    spacing: "sm",
                    contents: [
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "Total group spending",
                                    size: "sm",
                                    color: "#555555",
                                    flex: 0,
                                },
                                {
                                    type: "text",
                                    text: "$2.99",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "Total you paid for:",
                                    size: "sm",
                                    color: "#555555",
                                    flex: 0,
                                },
                                {
                                    type: "text",
                                    text: "$0.99",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "Your total share:",
                                    size: "sm",
                                    color: "#555555",
                                    flex: 0,
                                },
                                {
                                    type: "text",
                                    text: "$3.33",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "separator",
                            margin: "xxl",
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            margin: "xxl",
                            contents: [
                                {
                                    type: "text",
                                    text: "ITEMS",
                                    size: "sm",
                                    color: "#555555",
                                },
                                {
                                    type: "text",
                                    text: "3",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "TOTAL",
                                    size: "sm",
                                    color: "#555555",
                                },
                                {
                                    type: "text",
                                    text: "$7.31",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "CASH",
                                    size: "sm",
                                    color: "#555555",
                                },
                                {
                                    type: "text",
                                    text: "$8.0",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "CHANGE",
                                    size: "sm",
                                    color: "#555555",
                                },
                                {
                                    type: "text",
                                    text: "$0.69",
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "separator",
                    margin: "xxl",
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "md",
                    contents: [
                        {
                            type: "text",
                            text: "PAYMENT ID",
                            size: "xs",
                            color: "#aaaaaa",
                            flex: 0,
                        },
                        {
                            type: "text",
                            text: "#743289384279",
                            color: "#aaaaaa",
                            size: "xs",
                            align: "end",
                        },
                    ],
                },
            ],
        },
        styles: {
            footer: {
                separator: true,
            },
        },
    };
};
export { generateDebtNotify, generateGroupsMenu };
