import { useState, useEffect } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Checkbox,
    Avatar,
} from "@mui/material";
import { CURRENCY_OPTIONS } from "../../../../../global/constant";
const ExpensesBlock = ({ groupExpense, members }) => {
    const [checked, setChecked] = useState([1]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    console.log(groupExpense);
    return (
        <div
            className="group-information"
            style={{
                display: "block",
                width: "50%",
                height: "300px",
                backgroundColor: "green",
                fontSize: "5rem",
            }}
        >
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                }}
            >
                {groupExpense.map((expense, index) => {
                    const labelId = `checkbox-list-secondary-label-${expense._id}`;
                    let creditors;
                    if (Object.keys(expense.credit_users).length === 1) {
                        creditors = members[Object.keys(expense.credit_users)];
                    } else {
                        creditors = { name: "Multiple Members" };
                    }

                    return (
                        <ListItem key={expense._id} disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={``}
                                        src={`/static/images/avatar/${
                                            index + 1
                                        }.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    id={labelId}
                                    primary={`${expense.description}`}
                                    secondary={`${creditors.name} Paid for`}
                                />
                                <ListItemText
                                    id={labelId}
                                    primary={`${expense.description}`}
                                    secondary={`${creditors.name} Paid for`}
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
