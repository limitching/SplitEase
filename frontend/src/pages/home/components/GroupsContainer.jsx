import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import CreateGroupModal from "../components/CreateGroupModal";
import { Link } from "react-router-dom";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
} from "@mui/material";

const GroupsWrapper = styled(Paper)`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-context: center;
    background-color: white;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const CustomListItemText = styled(ListItemText)`
    .css-et1ao3-MuiTypography-root {
        font-weight: 700;
        font-size: 1rem;
    }
`;

const GroupLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const GroupsHeader = styled.h3`
    padding-top: 2rem;
    text-decoration: none;
    color: inherit;
`;

const GroupsContainer = () => {
    const { userGroups } = useContext(AuthContext);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    console.log(userGroups);
    const handleOpenCreateGroupModal = () => {
        setShowCreateGroupModal(true);
    };

    const handleCloseCreateGroupModal = () => {
        setShowCreateGroupModal(false);
    };

    return (
        <GroupsWrapper>
            <GroupsHeader>My Groups</GroupsHeader>
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: "95%",
                    bgcolor: "background.paper",
                }}
            >
                {userGroups.map((group, index) => {
                    return (
                        <GroupLink
                            key={group.slug}
                            to={`/group/${group.slug}/overview`}
                        >
                            <ListItem alignItems="center" disablePadding>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`${group.name}`}
                                            src={`${group.image}.jpg`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${group.name}`} />
                                </ListItemButton>
                            </ListItem>
                        </GroupLink>
                    );
                })}
                <ListItem alignItems="center" disablePadding>
                    <ListItemButton onClick={handleOpenCreateGroupModal}>
                        <ListItemAvatar>
                            <Avatar alt={`+`} src={`.jpg`} />
                        </ListItemAvatar>
                        <CustomListItemText
                            primary={`Create a new group`}
                            sx={[
                                { fontWeight: "bold" },
                                { fontSize: "26px" },
                                { color: "blue" },
                            ]}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
            <CreateGroupModal
                showCreateGroupModal={showCreateGroupModal}
                handleCloseCreateGroupModal={handleCloseCreateGroupModal}
            ></CreateGroupModal>
        </GroupsWrapper>
    );
};

export default GroupsContainer;
