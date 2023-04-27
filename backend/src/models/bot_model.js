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

const generateGroupOverView = (
    group,
    groupMembers,
    membersIndexMap,
    groupExpenses,
    userDebts,
    userCredits,
    user,
    user_index,
    groupCurrency,
    graph
) => {
    const totalGroupSpending = groupExpenses.reduce(
        (acc, { amount }) => acc + amount,
        0
    );
    const totalUserPaidFor = groupExpenses.reduce(
        (acc, { creditors_amounts }) => {
            if (creditors_amounts[user.id]) {
                return acc + creditors_amounts[user.id];
            }
            return acc;
        },
        0
    );
    const totalUserShare = groupExpenses.reduce(
        (acc, { debtors_weight, debtors_adjustment, amount }) => {
            const totalWeight = Array.from(debtors_weight.values()).reduce(
                (acc, curr) => acc + curr,
                0
            );

            const totalAdjustments = Array.from(
                debtors_adjustment.values()
            ).reduce((acc, curr) => acc + curr, 0);

            if (debtors_weight.get(user.id.toString())) {
                return (
                    acc +
                    ((amount - totalAdjustments) *
                        debtors_weight.get(user.id.toString())) /
                        totalWeight +
                    (debtors_adjustment.get(user.id.toString())
                        ? debtors_adjustment.get(user.id.toString())
                        : 0)
                );
            }
            return acc;
        },
        0
    );

    const body = {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: `${user.name}'S GROUP OVERVIEW`,
                    weight: "bold",
                    color: "#1DB446",
                    size: "sm",
                },
                {
                    type: "text",
                    text: group.name,
                    weight: "bold",
                    size: "xxl",
                    margin: "md",
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "Default currency",
                            size: "xs",
                            color: "#aaaaaa",
                            wrap: true,
                        },
                        {
                            type: "text",
                            text: groupCurrency.abbreviation,
                            size: "xs",
                            color: "#aaaaaa",
                            wrap: true,
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
                    layout: "vertical",
                    margin: "lg",
                    contents: [
                        {
                            type: "text",
                            text: "General Information",
                            size: "sm",
                            color: "#555555",
                            weight: "bold",
                        },
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
                                    text: `${groupCurrency.symbol} ${totalGroupSpending}`,
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                            margin: "sm",
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "Total expense you paid for",
                                    size: "sm",
                                    color: "#555555",
                                    flex: 0,
                                },
                                {
                                    type: "text",
                                    text: `${groupCurrency.symbol} ${totalUserPaidFor}`,
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
                                    text: "Your total share",
                                    size: "sm",
                                    color: "#555555",
                                    flex: 0,
                                },
                                {
                                    type: "text",
                                    text: `${groupCurrency.symbol} ${totalUserShare}`,
                                    size: "sm",
                                    color: "#111111",
                                    align: "end",
                                },
                            ],
                        },
                        {
                            type: "separator",
                            margin: "lg",
                        },
                    ],
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "lg",
                    spacing: "sm",
                    contents: [
                        {
                            type: "box",
                            layout: "horizontal",
                            margin: "none",
                            contents: [
                                {
                                    type: "text",
                                    text: "Current Settling Debts",
                                    size: "sm",
                                    color: "#555555",
                                    weight: "bold",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "sm",
                            contents:
                                userDebts.length === 0
                                    ? [
                                          {
                                              type: "box",
                                              layout: "horizontal",
                                              contents: [
                                                  {
                                                      type: "text",
                                                      text: "NO DEBTS 🎉",
                                                      size: "sm",
                                                      color: "#555555",
                                                      align: "start",
                                                      margin: "none",
                                                  },
                                              ],
                                              margin: "sm",
                                          },
                                      ]
                                    : userDebts.map(
                                          ([
                                              debtorIndex,
                                              creditorIndex,
                                              amount,
                                          ]) => {
                                              const text = {
                                                  type: "box",
                                                  layout: "horizontal",
                                                  margin: "none",
                                                  contents: [
                                                      {
                                                          type: "text",
                                                          text: `You owe ${groupMembers[creditorIndex].name}`,
                                                          size: "sm",
                                                          color: "#555555",
                                                      },
                                                      {
                                                          type: "text",
                                                          text: `${groupCurrency.symbol} ${amount}`,
                                                          size: "sm",
                                                          color: "#111111",
                                                          align: "end",
                                                      },
                                                  ],
                                              };
                                              return text;
                                          }
                                      ),
                        },

                        {
                            type: "box",
                            layout: "vertical",
                            margin: "none",
                            contents:
                                userCredits.length === 0
                                    ? []
                                    : userCredits.map(
                                          ([
                                              debtorIndex,
                                              creditorIndex,
                                              amount,
                                          ]) => {
                                              const text = {
                                                  type: "box",
                                                  layout: "horizontal",
                                                  margin: "none",
                                                  contents: [
                                                      {
                                                          type: "text",
                                                          text: `${groupMembers[debtorIndex].name} owe You`,
                                                          size: "sm",
                                                          color: "#555555",
                                                      },
                                                      {
                                                          type: "text",
                                                          text: `${groupCurrency.symbol} ${amount}`,
                                                          size: "sm",
                                                          color: "#111111",
                                                          align: "end",
                                                      },
                                                  ],
                                              };
                                              return text;
                                          }
                                      ),
                        },
                    ],
                },
                {
                    type: "separator",
                    margin: "xxl",
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "md",
                    contents: [
                        {
                            type: "text",
                            text: "Show default currency debts only",
                            size: "xs",
                            color: "#aaaaaa",
                            flex: 0,
                        },
                        {
                            type: "text",
                            text: "Visit the group page For more debts : )",
                            size: "xs",
                            color: "#aaaaaa",
                            flex: 0,
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
    return body;
};
export { generateDebtNotify, generateGroupsMenu, generateGroupOverView };
