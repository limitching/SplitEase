const API_HOST = "http://localhost:3000";
// const API_HOST = "https://api.splitease.cc";
// const WEB_HOST = "http://localhost:3001";
const WEB_HOST = "https://splitease.cc";

const AWS_CLOUDFRONT_HOST = "https://dxkgfgg79h3hz.cloudfront.net/";
const LIFF_ID = "1660896460-KPNk7vny";

const HEADER_BG_COLOR = "#F3CA40";
const CONTRAST_COLOR = "#1f39be";

const DASHBOARD_BG_COLOR = "#2b2b2b";

const GRAY_1 = "#DCDCDC";
const GRAY_2 = "#D3D3D3";
const GRAY_3 = "#C0C0C0";
const GRAY_4 = "#A9A9A9";
const GRAY_5 = "#808080";
const GRAY_6 = "#696969";
const GRAY_7 = "#464646";
const GRAY_8 = "#3C3C3C";

const GROUP_BG_COLOR = "#f0f0f0";

const SPLIT_METHODS = [
    "split equally",
    "split by exact amounts",
    "split by percentages",
    "split by shares",
    "split by adjustment",
];

const SPLIT_METHODS_ABBREVIATION = [
    "Equally",
    "Exact amounts",
    "Percentages",
    "Shares",
    "Adjustment",
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
    // {
    //     name: "overview",
    //     displayText: "Overview",
    // },
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
const AVATAR_LINK = "https://dxkgfgg79h3hz.cloudfront.net/avatars/";
const DEFAULT_AVATAR = [
    "bear.png",
    "dolphin.png",
    "koala_avatar.jpg",
    "sheep.png",
    "beaver.png",
    "duck.png",
    "lion_avatar.jpg",
    "sloth.png",
    "bird.png",
    "fox_avatar.jpg",
    "mouse.png",
    "stegosaurus.png",
    "cat.png",
    "frog.png",
    "owl.png",
    "tiger.png",
    "chicken.png",
    "ganesha.png",
    "panda.png",
    "tiger_avatar.jpg",
    "cow1.png",
    "giraffe.png",
    "parrot.png",
    "turtle.png",
    "cow2.png",
    "gorilla.png",
    "penguin.png",
    "weasel.png",
    "crab.png",
    "gorilla_avatar.jpg",
    "pig.png",
    "whale.png",
    "deer.png",
    "hedgehog.png",
    "puffer-fish.png",
    "wolf_avatar.jpg",
    "dog.png",
    "hippo.png",
    "rabbit_avatar.jpg",
    "dog_avatar.jpg",
    "jellyfish.png",
    "sea-lion.png",
];

const ANIMAL_AVATAR = [
    AWS_CLOUDFRONT_HOST + "avatars/dog_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/fox_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/gorilla_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/koala_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/lion_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/rabbit_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/tiger_avatar.jpg",
    AWS_CLOUDFRONT_HOST + "avatars/wolf_avatar.jpg",
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
    ANIMAL_AVATAR,
    DEFAULT_AVATAR,
    AVATAR_LINK,
    CONTRAST_COLOR,
    GRAY_1,
    GRAY_2,
    GRAY_3,
    GRAY_4,
    GRAY_5,
    GRAY_6,
    GRAY_7,
    GRAY_8,
    SPLIT_METHODS_ABBREVIATION,
};
