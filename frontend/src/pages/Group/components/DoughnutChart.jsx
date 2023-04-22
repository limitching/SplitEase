import styled from "styled-components";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useContext } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CURRENCY_OPTIONS } from "../../../global/constant";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutCenterText = styled.h4`
    color: white;
`;

const CenterDiv = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;

const colors = [
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

const DoughnutChart = ({ shouldPayUser }) => {
    const { balance, members, group } = useContext(GroupContext);

    const userName = members.map((user) => user.name);

    const [currencyObject] = CURRENCY_OPTIONS.filter(
        (currencyObject) => currencyObject.id === group.default_currency
    );

    const backgroundColors = balance.map((bal, index) =>
        bal < 0
            ? `rgba(0, 0, 0, ${
                  (Math.abs(bal) / Math.abs(Math.min(...balance))) * 0.6 + 0.3
              })`
            : colors[index]
    );

    // const totalAbsBalance = balance.reduce(
    //     (sum, balance) => sum + Math.abs(balance),
    //     0
    // );

    const totalAbsNegativeBalance = balance.reduce((sum, balance) => {
        if (balance < 0) {
            return sum + Math.abs(balance);
        } else {
            return sum;
        }
    }, 0);

    const negativeCount = balance.filter((bal) => bal < 0).length;

    const data = {
        labels: userName,
        datasets: [
            {
                data: balance.map((val) => (val > 0 ? null : val)),
                backgroundColor: backgroundColors,
                borderColor: "rgb(33, 150, 243)",
                borderWidth: 3,
                hoverBackgroundColor: colors,
                hidden: negativeCount === 0 ? true : false,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
            datalabels: {
                labels: {
                    amount: {
                        formatter: function (value, context) {
                            if (
                                Math.abs(value) / totalAbsNegativeBalance <
                                0.1
                            ) {
                                return null;
                            } else {
                                return value >= 0
                                    ? `+${currencyObject.symbol} value`
                                    : `-${currencyObject.symbol} ${Math.abs(
                                          value
                                      )}`;
                            }
                        },
                        color: function (context) {
                            return "white";
                        },
                        font: {
                            weight: "bold",
                        },
                    },
                    name: {
                        formatter: function (value, { dataIndex }) {
                            if (
                                Math.abs(value) / totalAbsNegativeBalance <
                                0.1
                            ) {
                                return null;
                            } else {
                                return userName[dataIndex];
                            }
                        },
                        color: function (context) {
                            return "white";
                        },
                        font: {
                            weight: "bold",
                        },
                        align: "top",
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var label = context.dataset.label || "Balance: ";

                        if (context.parsed !== null) {
                            if (context.parsed < 0) {
                                label += `-${currencyObject.symbol} ${Math.abs(
                                    context.parsed
                                )}`;
                            } else {
                                label += `${currencyObject.symbol} ${context.parsed}`;
                            }
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <div style={{ width: "275px" }}>
                <Doughnut
                    data={data}
                    options={options}
                    plugins={[ChartDataLabels]}
                    style={{
                        zIndex: 2,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        // textAlign: "center",
                    }}
                />
            </div>

            {negativeCount === 0 ? null : (
                <CenterDiv>
                    <DoughnutCenterText>
                        {shouldPayUser.name}
                        <br />
                        Should pay
                    </DoughnutCenterText>
                </CenterDiv>
            )}
        </div>
    );
};
export default DoughnutChart;
