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
];
export { SPLIT_METHODS, CURRENCY_OPTIONS, GROUP_TABS };
