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
export { generateDebtNotify };
