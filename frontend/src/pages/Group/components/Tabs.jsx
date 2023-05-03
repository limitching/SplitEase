import { GROUP_TABS, GROUP_TABS_VISITORS } from "../../../global/constant";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Menu, MenuItem } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "styled-components";
import ModifyGroupModal from "./ModifyGroupModal";

const StyledMenuWrapper = styled.div`
    color: ${(props) => props.textColor};
`;

const MENU_ITEM_HEIGHT = 48;

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

function NavTabs() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentLocation = location.pathname;
    const currentValue = currentLocation.split("/").pop();
    const { group } = useContext(GroupContext);
    const { userGroups } = useContext(AuthContext);
    const filterResult = userGroups.filter(
        (userGroup) => userGroup.id === group.id
    );

    const [value, setValue] = useState(
        filterResult.length === 0
            ? GROUP_TABS_VISITORS.findIndex((tab) => tab.name === currentValue)
            : GROUP_TABS.findIndex((tab) => tab.name === currentValue)
    );

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (filterResult.length === 0) {
            const tab = GROUP_TABS_VISITORS.findIndex(
                (tab) => tab.name === currentValue
            );
            setValue(tab);
        } else {
            const tab = GROUP_TABS.findIndex(
                (tab) => tab.name === currentValue
            );
            setValue(tab);
        }
    }, [value, filterResult.length, currentValue]);

    //Popper menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [showModifyGroupModal, setShowModifyGroupModal] = useState(false);

    const handleOpenModifyGroupModal = () => {
        setShowModifyGroupModal(true);
    };

    const handleCloseModifyGroupModal = () => {
        setShowModifyGroupModal(false);
    };

    return (
        <Container
            style={{
                marginTop: "0.25rem",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    // centered
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    {filterResult.length === 0
                        ? GROUP_TABS_VISITORS.map(
                              ({ name, displayText }, index) => (
                                  <LinkTab
                                      key={name}
                                      label={displayText}
                                      onClick={() => {
                                          window.scrollTo({
                                              top: 0,
                                              behavior: "smooth",
                                          });
                                          navigate(name);
                                      }}
                                  />
                              )
                          )
                        : GROUP_TABS.map(({ name, displayText }, index) => (
                              <LinkTab
                                  key={name}
                                  label={displayText}
                                  onClick={() => {
                                      window.scrollTo({
                                          top: 0,
                                          behavior: "smooth",
                                      });
                                      navigate(name);
                                  }}
                              />
                          ))}
                    <Tab label={<MoreVertIcon />} onClick={handleClick} />
                    <StyledMenuWrapper>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: MENU_ITEM_HEIGHT * 4.5,
                                    width: "15ch",
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleOpenModifyGroupModal();
                                    handleClose();
                                }}
                            >
                                Edit group
                            </MenuItem>
                        </Menu>
                    </StyledMenuWrapper>
                </Tabs>
            </Box>
            <ModifyGroupModal
                showModifyGroupModal={showModifyGroupModal}
                handleCloseModifyGroupModal={handleCloseModifyGroupModal}
            ></ModifyGroupModal>
        </Container>
    );
}
export default NavTabs;
