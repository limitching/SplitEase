import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext } from "react";

const MemberList = () => {
    const { members } = useContext(GroupContext);
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
                    <ListItem key={user.id}>
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    alt={user.name}
                                    src={user.image}
                                    sx={{ width: 50, height: 50 }}
                                />
                            </ListItemAvatar>
                            <Container>
                                <ListItemText
                                    primary={user.name}
                                    secondary={`Spent XXX NTD`}
                                />
                            </Container>
                            <Container>
                                <ListItemText
                                    primary={`-9527NT$`}
                                    sx={{ textAlign: "right" }}
                                />
                            </Container>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};
export default MemberList;
