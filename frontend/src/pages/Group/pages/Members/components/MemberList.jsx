import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Tooltip,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { AuthContext } from "../../../../../contexts/AuthContext";
import { useContext } from "react";
import { CURRENCY_OPTIONS } from "../../../../../global/constant";

const MemberList = () => {
    const { members, group, balance, spent } = useContext(GroupContext);
    const [currencyObject] = CURRENCY_OPTIONS.filter(
        (currencyObject) => currencyObject.id === group.default_currency
    );

    const { userGroups } = useContext(AuthContext);
    const filterResult = userGroups.filter(
        (userGroup) => userGroup.id === group.id
    );

    return (
        <List
            dense
            sx={{
                width: "100%",
                maxWidth: "100%",
                bgcolor: "background.paper",
            }}
        >
            {members.map((user, index) => {
                return (
                    <div key={"Member " + user.id}>
                        <ListItem>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Tooltip title={user.name}>
                                        <Avatar
                                            alt={user.name}
                                            src={user.image}
                                            sx={{ width: 50, height: 50 }}
                                        />
                                    </Tooltip>
                                </ListItemAvatar>
                                <Container>
                                    <ListItemText
                                        primary={user.name}
                                        secondary={
                                            filterResult.length === 0
                                                ? ``
                                                : `Spent ${currencyObject.symbol} ${spent[index]}`
                                        }
                                    />
                                </Container>
                                <Container>
                                    <ListItemText
                                        primary={
                                            filterResult.length === 0
                                                ? ``
                                                : `${balance[index]} ${currencyObject.symbol}`
                                        }
                                        sx={{ textAlign: "right" }}
                                    />
                                </Container>
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </div>
                );
            })}
        </List>
    );
};
export default MemberList;
