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
    Divider,
} from "@mui/material";
import { Container } from "react-bootstrap";
const SettlingDebtsBlock = () => {
    const { members, settlingDebts } = useContext(GroupContext);
    return (
        <List
            dense
            sx={{
                width: "100%",
                maxWidth: "100%",
                bgcolor: "background.paper",
            }}
        >
            {Object.entries(settlingDebts).map(
                ([currencyOption, transactions], index) => {
                    const [currency] = CURRENCY_OPTIONS.filter(
                        (currency) => currency.id === Number(currencyOption)
                    );
                    return transactions.map((transaction, index) => {
                        const labelId = `checkbox-list-secondary-label-${index}`;
                        const debtor = members[transaction[0]];
                        const creditor = members[transaction[1]];
                        const debtAmounts = transaction[2];

                        return (
                            <div key={"debtorBlockList" + index}>
                                <Divider></Divider>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`${debtor.name}`}
                                                src={debtor.image}
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        </ListItemAvatar>
                                        <Container>
                                            <ListItemText
                                                primary={debtor.name}
                                                secondary={`${
                                                    currency.symbol
                                                } ${Number(
                                                    debtAmounts.toFixed(2)
                                                )}`}
                                            />
                                        </Container>
                                        <Container>
                                            <ListItemText
                                                id={labelId}
                                                primary="→"
                                                sx={{ textAlign: "center" }}
                                            />
                                        </Container>
                                        <Container>
                                            <ListItemText
                                                primary={creditor.name}
                                                sx={{ textAlign: "right" }}
                                            />
                                        </Container>

                                        <ListItemAvatar>
                                            <Avatar
                                                alt={creditor.name}
                                                src={creditor.image}
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        </ListItemAvatar>
                                    </ListItemButton>
                                </ListItem>
                            </div>
                        );
                    });
                }
            )}
        </List>
    );
};

export default SettlingDebtsBlock;
