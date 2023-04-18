import styled from "styled-components";
import { Paper } from "@mui/material";
import { PageWrapper, ListWrapper } from "../../components/PageWrapper";
import { GroupContext } from "../../../../contexts/GroupContext";
import { useContext } from "react";
import { Container } from "react-bootstrap";

import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@mui/material";

const Header = styled.p`
    font-size: 1.5rem;
`;

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Members = () => {
    const { members } = useContext(GroupContext);
    return (
        <>
            <PageWrapper>
                <HeaderWrapper>
                    <Header>Member</Header>
                </HeaderWrapper>
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
                </ListWrapper>
            </PageWrapper>
        </>
    );
};
export default Members;
