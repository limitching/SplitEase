import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";
import { GroupContext } from "../../../../contexts/GroupContext";
import { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { CURRENCY_OPTIONS } from "../../../../global/constant";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
} from "@mui/material";

const Members = () => {
    const { members, group, balance, spent } = useContext(GroupContext);
    const [currencyObject] = CURRENCY_OPTIONS.filter(
        (currencyObject) => currencyObject.id === group.default_currency
    );

    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Members</h6>
                </HeaderTextContainer>
                <ListWrapper>
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
                                    <Divider></Divider>
                                    <ListItem>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={user.name}
                                                    src={user.image}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                />
                                            </ListItemAvatar>
                                            <Container>
                                                <ListItemText
                                                    primary={user.name}
                                                    secondary={`Spent ${currencyObject.symbol} ${spent[index]}`}
                                                />
                                            </Container>
                                            <Container>
                                                <ListItemText
                                                    primary={`${balance[index]} ${currencyObject.symbol}`}
                                                    sx={{ textAlign: "right" }}
                                                />
                                            </Container>
                                        </ListItemButton>
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </ListWrapper>
            </PageWrapper>
        </>
    );
};
export default Members;
