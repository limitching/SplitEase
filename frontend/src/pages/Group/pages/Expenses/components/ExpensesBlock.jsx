import { SPLIT_METHODS } from "../../../../../global/constant";
import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
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
    Tooltip,
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

const ExpensesBlock = () => {
    const { members, memberMap, indexMap, groupExpense } =
        useContext(GroupContext);
    const {
        setAmount,
        setChecked,
        setSubValues,
        setSubCredit,
        setSelectedCreditor,
        setSelectedCurrency,
        setSelectedSplitMethod,
        setSelectedExpense,
        setDescription,
        setExpenseTime,
        setShowModification,
    } = useContext(ExpenseContext);
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
        } else {
            const newSubCredit = Array(members.length).fill(0);
            for (const creditorId in expense.creditors_amounts) {
                const subCredit = expense.creditors_amounts[creditorId];
                const creditIndex = indexMap.get(Number(creditorId));
                newSubCredit[creditIndex] = subCredit;
            }
            setSubCredit(newSubCredit);
            setSelectedCreditor("multi");
        }
        const expenseChecked = Object.keys(expense.debtors_weight).map(
            (debtorsId) => memberMap.get(Number(debtorsId))
        );
        setChecked(expenseChecked);
        setSelectedCurrency(expense.currency_option);
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
                    (currency) => currency.id === expense.currency_option
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
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Tooltip title={creditors.name}>
                                    <Avatar
                                        alt={creditors.name}
                                        src={creditors.image}
                                        sx={{ width: 50, height: 50 }}
                                    />
                                </Tooltip>
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
                                            <Tooltip title={debtor.name}>
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
                                            </Tooltip>
                                        ))}
                                    </AvatarGroup>
                                </ThemeProvider>
                            </Container>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};
export default ExpensesBlock;
