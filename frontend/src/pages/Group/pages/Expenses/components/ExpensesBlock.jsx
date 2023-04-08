import { SPLIT_METHODS } from "../../../../../global/constant";
import styled from "styled-components";
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
    groupExpense,
    members,
    memberMap,
    setSelectedExpense,
    setShowModification,
    setAmount,
    setSelectedCreditor,
    setChecked,
    setSelectedCurrency,
    setSelectedSplitMethod,
    setExpenseTime,
    setDescription,
}) => {
    const handleShow = () => {
        setShowModification(true);
    };

    const handleExpenseItemClick = (expense) => {
        // open modal and pass expense data to Transaction component
        // TODO: remove log
        console.log(expense);
        setSelectedExpense(expense);
        setAmount(expense.amount);
        if (Object.keys(expense.credit_users).length === 1) {
            const creditors = memberMap.get(
                Number(Object.keys(expense.credit_users)[0])
            );
            setSelectedCreditor(creditors.id);
        }
        const expenseChecked = Object.keys(expense.debt_users).map(
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
        handleShow();
    };

    return (
        <div
            className="group-information"
            style={{
                width: "50%",
                backgroundColor: "lightgreen",
                fontSize: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                }}
            >
                {groupExpense.map((expense, index) => {
                    const labelId = `checkbox-list-secondary-label-${expense._id}`;
                    let creditors;
                    if (Object.keys(expense.credit_users).length === 1) {
                        const creditorId = Object.keys(expense.credit_users)[0];
                        creditors = memberMap.get(Number(creditorId));
                    } else {
                        creditors = { name: "Multiple Members" };
                    }
                    const [currencyOption] = CURRENCY_OPTIONS.filter(
                        (currency) => currency.id === expense.currencyOption
                    );

                    const debtors = Object.keys(expense.debt_users).map(
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
                                <ListItemText
                                    id={labelId}
                                    primary={
                                        expense.description === ""
                                            ? "Expense"
                                            : `${expense.description}`
                                    }
                                    secondary={`${creditors.name} Paid for`}
                                />
                                <StyledListItemTextForAmount
                                    id={labelId}
                                    primary={`${currencyOption.symbol} ${expense.amount}`}
                                    secondary={
                                        <ThemeProvider theme={avatarTheme}>
                                            <AvatarGroup total={debtors.length}>
                                                {debtors.map((debtor) => (
                                                    <Avatar
                                                        key={debtor.id}
                                                        alt={debtor.name}
                                                        src={
                                                            debtor.image ===
                                                            null
                                                                ? ".jpg"
                                                                : debtor.image
                                                        }
                                                    />
                                                ))}
                                            </AvatarGroup>
                                        </ThemeProvider>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};
export default ExpensesBlock;