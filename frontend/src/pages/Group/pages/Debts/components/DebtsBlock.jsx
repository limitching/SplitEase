import { CURRENCY_OPTIONS } from "../../../../../global/constant";
import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
const DebtsBlock = () => {
    const { members, debts } = useContext(GroupContext);
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
                {Object.entries(debts).map(([currencyOption, transactions]) => {
                    const [currency] = CURRENCY_OPTIONS.filter(
                        (currency) => currency.id === Number(currencyOption)
                    );
                    return transactions.map((transaction, index) => {
                        const labelId = `checkbox-list-secondary-label-${index}`;
                        const creditor = members[transaction[0]];
                        const debtor = members[transaction[1]];
                        const debtAmounts = transaction[2];

                        return (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ListItemAvatar
                                        sx={{
                                            display: "flex",
                                            justifyContent: "left",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            alt={`${creditor.name}`}
                                            src={`/static/images/avatar/${
                                                index + 1
                                            }.jpg`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        id={labelId}
                                        primary={creditor.name}
                                        secondary={`${currency.symbol} ${debtAmounts}`}
                                        sx={{
                                            textAlign: "LEFT",
                                            maxWidth: "130px",
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary="→"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            maxWidth: "50px",
                                        }}
                                    />
                                    <ListItemText
                                        id={labelId}
                                        primary={debtor.name}
                                        sx={{
                                            textAlign: "right",
                                            maxWidth: "130px",
                                        }}
                                    />
                                    <ListItemAvatar
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            alt={`${debtor.name}`}
                                            src={`/static/images/avatar/${
                                                index + 1
                                            }.jpg`}
                                        />
                                    </ListItemAvatar>
                                </ListItemButton>
                            </ListItem>
                        );
                    });
                })}
            </List>
        </div>
    );
};

export default DebtsBlock;
