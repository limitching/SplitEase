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
const DebtsBlock = ({ members }) => {
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
                {members.map((member, index) => {
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

export default DebtsBlock;
