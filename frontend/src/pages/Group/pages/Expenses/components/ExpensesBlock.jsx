import { SPLIT_METHODS } from "../../../../../global/constant";
import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    AvatarGroup,
} from "@mui/material";

import { CURRENCY_OPTIONS } from "../../../../../global/constant";

const avatarTheme = createTheme({
    components: {
        MuiAvatarGroup: {
            styleOverrides: {
                avatar: { width: "20px", height: "20px", fontSize: "0.75rem" },
            },
        },
    },
});

const StyledListItemTextForAmount = styled(ListItemText)`
    text-align: right;
    font-weight: bold;
    color: blue;
`;

const ExpensesBlock = ({
    setSelectedExpense,
    setShowModification,
    setAmount,
    setSelectedCreditor,
    setChecked,
    setSelectedCurrency,
    setSelectedSplitMethod,
    setExpenseTime,
    setDescription,
    subValues,
    setSubValues,
}) => {
    const { members, memberMap, indexMap, groupExpense } =
        useContext(GroupContext);

    const handleShow = () => {
        setShowModification(true);
    };

    const handleExpenseItemClick = (expense) => {
        // open modal and pass expense data to Transaction component
        // TODO: remove log
        // console.log(expense);
        setSelectedExpense(expense);
        setAmount(expense.amount);
        if (Object.keys(expense.creditors_amounts).length === 1) {
            const creditors = memberMap.get(
                Number(Object.keys(expense.creditors_amounts)[0])
            );
            setSelectedCreditor(creditors.id);
        }
        const expenseChecked = Object.keys(expense.debtors_weight).map(
            (debtorsId) => memberMap.get(Number(debtorsId))
        );
        setChecked(expenseChecked);
        setSelectedCurrency(expense.currencyOption);
        setSelectedSplitMethod(SPLIT_METHODS.indexOf(expense.split_method));

        // Convert GMT datetime to local datetime
        const gmtDate = new Date(expense.date);
        const timeZoneOffset = gmtDate.getTimezoneOffset() * 60 * 1000; //offset in milliseconds
        const localISOTime = new Date(gmtDate - timeZoneOffset)
            .toISOString()
            .substring(0, 16);

        setExpenseTime(localISOTime);
        setDescription(expense.description);
        if (SPLIT_METHODS.indexOf(expense.split_method) !== 4) {
            const debtorsWeight = Object.entries(expense.debtors_weight);
            const expenseSubValues = Array(members.length).fill(0);
            for (const [debtorId, weight] of debtorsWeight) {
                expenseSubValues[indexMap.get(Number(debtorId))] = weight;
            }
            setSubValues(expenseSubValues);
        } else {
            const expenseSubValues = Object.values(expense.debtors_adjustment);
            setSubValues(expenseSubValues);
        }

        handleShow();
    };
    if (!members) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="expense-block"
            style={{
                width: "50%",
                height: "40vh",
                overflow: "scroll",
                // backgroundColor: "lightgreen",
                fontSize: "5rem",
                display: "flex",

                justifyContent: "center",
                alignItems: "start",
                boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            }}
        >
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    bgcolor: "background.paper",
                }}
            >
                {groupExpense.map((expense, index) => {
                    const labelId = `checkbox-list-secondary-label-${expense._id}`;
                    let creditors;
                    if (Object.keys(expense.creditors_amounts).length === 1) {
                        const creditorId = Object.keys(
                            expense.creditors_amounts
                        )[0];
                        creditors = memberMap.get(Number(creditorId));
                    } else {
                        creditors = { name: "Multiple Members" };
                    }
                    const [currencyOption] = CURRENCY_OPTIONS.filter(
                        (currency) => currency.id === expense.currencyOption
                    );

                    const debtors = Object.keys(expense.debtors_weight).map(
                        (debtorId) => {
                            return memberMap.get(Number(debtorId));
                        }
                    );

                    return (
                        <ListItem
                            key={expense._id}
                            onClick={() => handleExpenseItemClick(expense)}
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`${creditors.name}`}
                                        src={`/static/images/avatar/${
                                            index + 1
                                        }.jpg`}
                                    />
                                </ListItemAvatar>
                                <Container>
                                    <ListItemText
                                        id={labelId}
                                        primary={
                                            expense.description === ""
                                                ? "Expense"
                                                : `${expense.description}`
                                        }
                                        secondary={`${creditors.name} Paid for`}
                                    />
                                </Container>

                                <Container>
                                    <StyledListItemTextForAmount
                                        id={labelId}
                                        primary={`${currencyOption.symbol} ${expense.amount}`}
                                    />
                                    <ThemeProvider theme={avatarTheme}>
                                        <AvatarGroup total={debtors.length}>
                                            {debtors.map((debtor, index) => (
                                                <Avatar
                                                    key={
                                                        expense._id +
                                                        "_debtor_" +
                                                        index
                                                    }
                                                    alt={debtor.name}
                                                    src={
                                                        debtor.image === null
                                                            ? ".jpg"
                                                            : debtor.image
                                                    }
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </ThemeProvider>
                                </Container>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};
export default ExpensesBlock;
