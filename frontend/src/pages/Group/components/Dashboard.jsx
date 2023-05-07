import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";

import { Container } from "react-bootstrap";
import DoughnutChart from "./DoughnutChart";
// import HorizontalBarChart from "./HorizontalBarChart";
import { CURRENCY_OPTIONS, DASHBOARD_BG_COLOR } from "../../../global/constant";
import CountUp from "react-countup";

const Dashboard = styled.div`
    width: 100%;
    // height: 300px;
    height: 30vh;
    min-height: 300px;
    background-color: ${DASHBOARD_BG_COLOR};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const TextWrapper = styled.div`
    color: white;
`;

const UserDashboard = styled(Dashboard)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-context: center;
    align-items: center;
    background-color: ${DASHBOARD_BG_COLOR};
`;

const DashboardWrapper = styled(Dashboard)`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-context: center;
    align-items: center;
    width: 50vw;
    gap: 2rem;
`;

const DoughnutWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-context: center;
    align-items: center;
    width: 100%;
    max-width: 300px;
`;

const DashboardText = styled.p`
    margin-bottom: 0;
`;

const LargeTextContainer = styled.div`
    margin-top: 1rem;
`;

const TextContainer = styled(Container)`
    @media (max-width: 768px) {
        display: none;
    }
`;

const GroupDashboard = () => {
    const {
        group,
        members,
        balance,
        groupExpense,
        isLoading,
        indexMap,
        spent,
        usersShare,
        debts,
    } = useContext(GroupContext);
    const { user } = useContext(AuthContext);
    const [shouldPayUser, setShouldPayUser] = useState({});
    const userIndex = indexMap.get(user.id);

    const [currencyObject] = CURRENCY_OPTIONS.filter(
        (currencyObject) => currencyObject.id === group.default_currency
    );

    useEffect(() => {
        if (
            members.length !== 0 &&
            balance.length === members.length &&
            usersShare.length === members.length
        ) {
            const whoShouldPayIndex = balance.indexOf(Math.min(...balance));
            setShouldPayUser(members[whoShouldPayIndex]);
        }
    }, [members, balance, usersShare]);
    const totalGroupExpense = groupExpense.reduce((sum, expense) => {
        if (expense.currency_option === group.default_currency) {
            return sum + expense.amount;
        }
        return sum;
    }, 0);

    if (isLoading) {
        return <></>;
    }

    // console.log(indexMap);
    // console.log(userIndex);
    // console.log(usersShare[userIndex]);
    let isNoDebts = true;

    for (let currency_option in debts) {
        if (debts[currency_option].length !== 0) {
            isNoDebts = false;
            break;
        }
    }

    return (
        <UserDashboard>
            <DashboardWrapper id="dashboard">
                {isNoDebts ? (
                    <img
                        alt=""
                        src="/assets/noDebt.svg"
                        style={{
                            maxWidth: "50%",
                            minWidth: "300px",
                            height: "300px",
                            width: "auto",
                        }}
                    ></img>
                ) : (
                    <DoughnutWrapper>
                        <DoughnutChart
                            shouldPayUser={shouldPayUser}
                        ></DoughnutChart>
                    </DoughnutWrapper>
                )}

                {/* <HorizontalBarChart></HorizontalBarChart> */}

                <TextContainer>
                    <TextWrapper>
                        <h1
                            style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {group.name}
                        </h1>
                        <div style={{ display: "flex" }}>
                            <div>
                                <DashboardText>{`Total group spending: `}</DashboardText>
                                <DashboardText>{`Total you paid for: `}</DashboardText>
                            </div>
                            <div style={{ marginLeft: "2rem" }}>
                                <DashboardText>
                                    {`${currencyObject.symbol} `}
                                    <CountUp
                                        duration={1}
                                        end={totalGroupExpense}
                                        style={{
                                            fontSize: "1rem",
                                        }}
                                    />
                                </DashboardText>
                                <DashboardText>
                                    {`${currencyObject.symbol} `}
                                    <CountUp
                                        duration={1}
                                        end={spent[userIndex]}
                                        style={{
                                            fontSize: "1rem",
                                        }}
                                    />
                                </DashboardText>
                            </div>
                        </div>
                        <LargeTextContainer>
                            {userIndex ? (
                                <p>
                                    {`Your total share: ${currencyObject.symbol} `}
                                    <CountUp
                                        duration={1}
                                        end={usersShare[userIndex]}
                                        style={{
                                            fontSize: "1rem",
                                        }}
                                    />
                                </p>
                            ) : null}

                            {members.length === 0 ? null : isNoDebts ? (
                                <>
                                    <h4>No debts !</h4>
                                    <h4>No one should pay</h4>
                                </>
                            ) : (
                                <>
                                    <h4>{`${shouldPayUser.name} owes the most money`}</h4>
                                    <h4>{`Recommend ${shouldPayUser.name} to pay`}</h4>
                                </>
                            )}
                        </LargeTextContainer>
                    </TextWrapper>
                </TextContainer>
            </DashboardWrapper>
        </UserDashboard>
    );
};
export default GroupDashboard;
