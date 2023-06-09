import styled from "styled-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import CreateGroupModal from "./CreateGroupModal";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Paper } from "@mui/material";
import { AWS_CLOUDFRONT_HOST } from "../../../global/constant";

const GroupsWrapper = styled(Paper)`
  width: 90%;
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
  padding: 1rem 0;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 768px) {
    width: 40%;
  }
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

const GroupsHeader = styled.h6`
  text-decoration: none;
  color: inherit;
  font-weight: bold;
  margin-bottom: 0px;
`;

const GroupsContainer = () => {
  const { userGroups } = useContext(AuthContext);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

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
          bgcolor: "background.paper"
        }}
      >
        {userGroups.map((group, index) => {
          return (
            <GroupLink key={group.slug} to={`/group/${group.slug}/expenses`}>
              <ListItem alignItems="center" disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`${group.name}`} src={`${group.photo}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${group.name}`}
                    secondary={group.description}
                    primaryTypographyProps={{
                      fontSize: "1rem"
                    }}
                    // sx={[{ color: "blue" }]}
                  />
                </ListItemButton>
              </ListItem>
            </GroupLink>
          );
        })}
        <ListItem alignItems="center" disablePadding>
          <ListItemButton onClick={handleOpenCreateGroupModal}>
            <ListItemAvatar>
              <Avatar alt={`+`} src={`${AWS_CLOUDFRONT_HOST}group_image_default/plus.png`} />
            </ListItemAvatar>
            <CustomListItemText primary={`Create a new group`} />
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
