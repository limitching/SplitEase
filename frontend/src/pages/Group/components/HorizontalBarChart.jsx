import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useContext } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import autocolors from "chartjs-plugin-autocolors";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    // Colors,
    autocolors
);

const backgroundColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(54, 162, 235, 0.3)",
    "rgba(255, 206, 86, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(153, 102, 255, 0.3)",
    "rgba(255, 159, 64, 0.3)",
    "rgba(255, 99, 132, 0.1)",
];

const borderColors = backgroundColors.map((color) => {
    const alpha = 1; // set alpha to 1
    const rgbaValues = color.slice(5, -1).split(","); // extract the RGBA values from the string
    const r = rgbaValues[0].trim();
    const g = rgbaValues[1].trim();
    const b = rgbaValues[2].trim();
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
});

const HorizontalBarChart = () => {
    const { balance, members, spent } = useContext(GroupContext);
    const userName = members.map((user) => user.name);

    const min = Math.min(...balance);
    const max = Math.max(...balance);
    const axisRange = Math.max(Math.abs(min), Math.abs(max));

    const randomColor = () => {
        return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
    };

    const sortedBalance = balance
        .map((value, index) => ({ value, index }))
        .sort((a, b) => a.value - b.value);
    console.log(balance);
    console.log("sortedBalance", sortedBalance);

    const labels = userName;

    const data = {
        labels,
        datasets: [
            {
                label: "Balance",
                data: balance,
                borderColor: undefined,
                backgroundColor: backgroundColors,
            },
        ],
    };
    console.log(
        sortedBalance
            .slice(0, 2)
            .concat(sortedBalance.slice(-2))
            .map((balance) => balance.value)
    );

    const options = {
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 0,
            },
        },
        responsive: true,
        scales: {
            x: {
                display: false,
                grid: {
                    display: false,
                },
                suggestedMin: -axisRange,
                suggestedMax: axisRange,
            },
            y: {
                display: false,
                grid: {
                    display: false,
                },
                ticks: {},
            },
        },
        plugins: {
            // autocolors: {
            //     mode: "data",
            //     enabled: true,
            // },
            // colors: {
            //     forceOverride: true,
            // },
            legend: { display: false },
            tooltip: {
                position: "nearest", // 將 tooltip 放在最近的點上
                // caretPadding: 10, // 設定 caret 與 tooltip 之間的距離
            },
            datalabels: {
                labels: {
                    amount: {
                        anchor: function ({ dataset, dataIndex }) {
                            if (dataset.data[dataIndex] >= 0) {
                                return "start";
                            } else {
                                return "end";
                            }
                        },
                        align: function ({ dataset, dataIndex }) {
                            if (dataset.data[dataIndex] >= 0) {
                                return "right";
                            } else {
                                return "left";
                            }
                        },
                        formatter: function (value, context) {
                            return value >= 0
                                ? "+$" + value
                                : "-$" + Math.abs(value);
                        },
                        color: function (context) {
                            return "black";
                        },
                        font: {
                            weight: "bold",
                        },
                    },
                    name: {
                        anchor: function ({ dataset, dataIndex }) {
                            if (dataset.data[dataIndex] >= 0) {
                                return "start";
                            } else {
                                return "end";
                            }
                        },
                        align: function ({ dataset, dataIndex }) {
                            if (dataset.data[dataIndex] >= 0) {
                                return "left";
                            } else {
                                return "right";
                            }
                        },
                        formatter: function (value, { dataIndex }) {
                            console.log(dataIndex);
                            return userName[dataIndex];
                        },
                        color: function (context) {
                            return "gray";
                        },
                        font: {
                            weight: "bold",
                        },
                    },
                },
            },
        },
    };
    return (
        <div>
            <Bar
                data={data}
                options={options}
                plugins={[ChartDataLabels, autocolors]}
            />
        </div>
    );
};

export default HorizontalBarChart;
