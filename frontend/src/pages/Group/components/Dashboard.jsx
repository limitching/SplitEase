import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { Avatar } from "@mui/material";
import { Container } from "react-bootstrap";
import DoughnutChart from "./DoughnutChart";
// import HorizontalBarChart from "./HorizontalBarChart";
import { CURRENCY_OPTIONS, DASHBOARD_BG_COLOR } from "../../../global/constant";
import CountUp from "react-countup";

const Dashboard = styled.div`
    width: 100%;
    height: 300px;
    background-color: ${DASHBOARD_BG_COLOR};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const TextWrapper = styled.div`
    color: white;
`;

const VisitorDashboard = styled(Dashboard)`
    background-color: #f4f4f4;
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

const JoinButton = styled.button`
    background-color: #00b2a5;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #008c7d;
    }
    &:active {
        transform: scale(0.98);
    }
`;

const GroupDashboard = () => {
    const {
        group,
        members,
        invitation_code,
        slug,
        balance,
        groupExpense,
        isLoading,
        indexMap,
        spent,
        usersShare,
        debts,
    } = useContext(GroupContext);
    const { userGroups, jwtToken, isLogin, joinGroup, user } =
        useContext(AuthContext);
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
    const [owner] = members.filter((user) => user.id === group.owner);

    const filterResult = userGroups.filter(
        (userGroup) => userGroup.id === group.id
    );

    if (isLoading) {
        return <></>;
    }

    if (filterResult.length === 0) {
        return (
            <VisitorDashboard>
                <Avatar
                    alt={owner.name}
                    src={owner.image}
                    sx={{ width: 100, height: 100, fontSize: "3rem" }}
                ></Avatar>
                <h3>{`${owner.name} wants to invite you to a group`} </h3>
                <h1>{group.name}</h1>
                <h3>{group.description}</h3>
                {isLogin ? (
                    <JoinButton
                        onClick={() =>
                            joinGroup(slug, invitation_code, jwtToken)
                        }
                    >
                        Join Group
                    </JoinButton>
                ) : (
                    <JoinButton disabled>Please Login</JoinButton>
                )}
            </VisitorDashboard>
        );
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
            <DashboardWrapper>
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

                <Container>
                    <TextWrapper>
                        <h1>{group.name}</h1>

                        <p>
                            {`Total group spending: ${currencyObject.symbol} `}
                            <CountUp
                                duration={1}
                                end={totalGroupExpense}
                                style={{
                                    fontSize: "1rem",
                                }}
                            />
                        </p>
                        <p>
                            {`Total you paid for: ${currencyObject.symbol} `}
                            <CountUp
                                duration={1}
                                end={spent[userIndex]}
                                style={{
                                    fontSize: "1rem",
                                }}
                            />
                        </p>
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

                        {members.length === 0 ? null : (
                            <>
                                <h4>{`${shouldPayUser.name} owes the most money`}</h4>
                                <h4>{`${shouldPayUser.name} should pay`}</h4>
                            </>
                        )}
                    </TextWrapper>
                </Container>
            </DashboardWrapper>
        </UserDashboard>
    );
};
export default GroupDashboard;
