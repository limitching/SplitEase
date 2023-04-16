import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import CreateGroupModal from "../components/CreateGroupModal";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@mui/material";

const GroupsWrapper = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
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
            <h3>My Groups</h3>
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
                        <ListItem
                            alignItems="center"
                            key={group.id}
                            disablePadding
                        >
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
