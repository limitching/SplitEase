const API_HOST = "http://localhost:3000";
// const API_HOST = "https://api.splitease.cc";
// const WEB_HOST = "http://localhost:3001";
const WEB_HOST = "https://splitease.cc";

const AWS_CLOUDFRONT_HOST = "https://dxkgfgg79h3hz.cloudfront.net/";
const LIFF_ID = "1660896460-KPNk7vny";

const HEADER_BG_COLOR = "#F3CA40";

const DASHBOARD_BG_COLOR = "#2b2b2b";

const GROUP_BG_COLOR = "#f0f0f0";

const SPLIT_METHODS = [
    "split equally",
    "split by exact amounts",
    "split by percentages",
    "split by shares",
    "split by adjustment",
];
const CURRENCY_OPTIONS = [
    {
        id: 1,
        abbreviation: "TWD",
        symbol: "NT$",
    },
    {
        id: 2,
        abbreviation: "USD",
        symbol: "$",
    },
    {
        id: 3,
        abbreviation: "EUR",
        symbol: "€",
    },
    {
        id: 4,
        abbreviation: "JPY",
        symbol: "¥",
    },
    {
        id: 5,
        abbreviation: "GBP",
        symbol: "£",
    },
    {
        id: 6,
        abbreviation: "AUD",
        symbol: "A$",
    },
    {
        id: 7,
        abbreviation: "CAD",
        symbol: "C$",
    },
    {
        id: 8,
        abbreviation: "CHF",
        symbol: "CHF",
    },
    {
        id: 9,
        abbreviation: "CNY",
        symbol: "CN¥",
    },
    {
        id: 10,
        abbreviation: "HKD",
        symbol: "HK$",
    },
];

const CURRENCY_MAP = {
    1: { abbreviation: "TWD", symbol: "NT$" },
    2: { abbreviation: "USD", symbol: "$" },
    3: { abbreviation: "USD", symbol: "$" },
    4: { abbreviation: "JPY", symbol: "¥" },
    5: { abbreviation: "GBP", symbol: "£" },
    6: { abbreviation: "AUD", symbol: "A$" },
    7: { abbreviation: "CAD", symbol: "C$" },
    8: { abbreviation: "CHF", symbol: "CHF" },
    9: { abbreviation: "CNY", symbol: "CN¥" },
    10: { abbreviation: "HKD", symbol: "HK$" },
};
const GROUP_TABS = [
    {
        name: "overview",
        displayText: "Overview",
    },
    {
        name: "expenses",
        displayText: "Expenses",
    },
    {
        name: "debts",
        displayText: "Debts",
    },
    {
        name: "settlement",
        displayText: "Settlement",
    },
    {
        name: "members",
        displayText: "members",
    },
    {
        name: "activities",
        displayText: "Recent Activities",
    },
    {
        name: "join",
        displayText: "Invite Friends",
    },
];

const GROUP_TABS_VISITORS = [
    {
        name: "members",
        displayText: "members",
    },
    {
        name: "join",
        displayText: "Invite Friends",
    },
];

const CHART_COLOR = [
    "rgba(0, 122, 255, 0.8)",
    "rgba(0, 216, 155, 0.8)",
    "rgba(255, 65, 108, 0.8)",
    "rgba(255, 195, 0, 0.8)",
    "rgba(255, 87, 51, 0.8)",
    "rgba(255, 159, 26, 0.8)",
    "rgba(255, 102, 0, 0.8)",
    "rgba(94, 53, 177, 0.8)",
    "rgba(153, 102, 204, 0.8)",
    "rgba(51, 204, 204, 0.8)",
    "rgba(255, 204, 204, 0.8)",
    "rgba(0, 153, 153, 0.8)",
    "rgba(51, 153, 51, 0.8)",
    "rgba(0, 153, 0, 0.8)",
    "rgba(255, 0, 102, 0.8)",
    "rgba(102, 102, 102, 0.8)",
    "rgba(255, 153, 153, 0.8)",
    "rgba(255, 255, 0, 0.8)",
    "rgba(0, 204, 255, 0.8)",
    "rgba(204, 204, 204, 0.8)",
];

const HOVER_CHART_COLOR = [
    "rgba(0, 122, 255, 0.64)",
    "rgba(0, 216, 155, 0.64)",
    "rgba(255, 65, 108, 0.64)",
    "rgba(255, 195, 0, 0.64)",
    "rgba(255, 87, 51, 0.64)",
    "rgba(255, 159, 26, 0.64)",
    "rgba(255, 102, 0, 0.64)",
    "rgba(94, 53, 177, 0.64)",
    "rgba(153, 102, 204, 0.64)",
    "rgba(51, 204, 204, 0.64)",
    "rgba(255, 204, 204, 0.64)",
    "rgba(0, 153, 153, 0.64)",
    "rgba(51, 153, 51, 0.64)",
    "rgba(0, 153, 0, 0.64)",
    "rgba(255, 0, 102, 0.64)",
    "rgba(102, 102, 102, 0.64)",
    "rgba(255, 153, 153, 0.64)",
    "rgba(255, 255, 0, 0.64)",
    "rgba(0, 204, 255, 0.64)",
    "rgba(204, 204, 204, 0.64)",
];

export {
    API_HOST,
    WEB_HOST,
    LIFF_ID,
    SPLIT_METHODS,
    CURRENCY_OPTIONS,
    CURRENCY_MAP,
    GROUP_TABS,
    GROUP_TABS_VISITORS,
    HEADER_BG_COLOR,
    DASHBOARD_BG_COLOR,
    GROUP_BG_COLOR,
    CHART_COLOR,
    HOVER_CHART_COLOR,
    AWS_CLOUDFRONT_HOST,
};
