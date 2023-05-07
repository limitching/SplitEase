import { SPLIT_METHODS } from "../../../../../global/constant";
import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    AvatarGroup,
    Tooltip,
    Divider,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { HeaderTextContainer } from "../../../components/PageWrapper";

import {
    CURRENCY_OPTIONS,
    ANIMAL_AVATAR,
} from "../../../../../global/constant";

const StyledListItemTextForAmount = styled(ListItemText)`
    text-align: right;
    font-weight: bold;
    color: blue;
`;

const StyledAvatarGroup = styled(AvatarGroup)`
    .css-sxh3gq-MuiAvatar-root-MuiAvatarGroup-avatar {
        width: 20px;
        height: 20px;
        font-size: 12px;
    }
    .MuiAvatarGroup-avatar {
        width: 20px;
        height: 20px;
        font-size: 12px;
    }
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
        <>
            <HeaderTextContainer>
                <h5>
                    {groupExpense.length === 0 ? "No Expense :)" : "Expenses"}
                </h5>
            </HeaderTextContainer>

            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    bgcolor: "background.paper",
                }}
            >
                <Divider></Divider>
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
                        <div key={expense._id}>
                            <ListItem
                                onClick={() => handleExpenseItemClick(expense)}
                                id={index === 0 ? "expense-button" : null}
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Tooltip title={creditors?.name}>
                                            <Avatar
                                                alt={creditors?.name}
                                                src={
                                                    creditors?.image
                                                        ? creditors.image
                                                        : ANIMAL_AVATAR[
                                                              indexMap.get(
                                                                  creditors?.id
                                                              )
                                                          ]
                                                }
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        </Tooltip>
                                    </ListItemAvatar>
                                    <Container>
                                        <ListItemText
                                            primary={
                                                expense.description === ""
                                                    ? "Expense"
                                                    : `${expense.description}`
                                            }
                                            primaryTypographyProps={{
                                                width: "15vw",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                            secondary={`${creditors?.name} Paid for`}
                                            secondaryTypographyProps={{
                                                width: "15vw",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        />
                                    </Container>

                                    <Container style={{ maxWidth: "100px" }}>
                                        <StyledListItemTextForAmount
                                            id={labelId}
                                            primary={`${currencyOption.symbol} ${expense.amount}`}
                                        />
                                        <StyledAvatarGroup
                                            total={debtors.length}
                                            sx={{ fontSize: "12px" }}
                                        >
                                            {debtors?.map((debtor, index) => (
                                                <Tooltip
                                                    key={
                                                        expense._id +
                                                        "_debtor_" +
                                                        index
                                                    }
                                                    title={debtor?.name}
                                                >
                                                    <Avatar
                                                        alt={debtor?.name}
                                                        src={
                                                            debtor?.image
                                                                ? debtor.image
                                                                : ANIMAL_AVATAR[
                                                                      indexMap.get(
                                                                          debtor?.id
                                                                      )
                                                                  ]
                                                        }
                                                        sx={{
                                                            width: "20px",
                                                            height: "20px",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </StyledAvatarGroup>
                                    </Container>
                                    <Container style={{ maxWidth: "120px" }}>
                                        <StyledListItemTextForAmount
                                            primary={
                                                <Chip label={expense.status} />
                                            }
                                        />
                                    </Container>
                                </ListItemButton>
                            </ListItem>
                            <Divider></Divider>
                        </div>
                    );
                })}
            </List>
        </>
    );
};
export default ExpensesBlock;
