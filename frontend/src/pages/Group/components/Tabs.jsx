import { GROUP_TABS, GROUP_TABS_VISITORS } from "../../../global/constant";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";

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

    return (
        <Container>
            <Box sx={{ width: "100%" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    centered
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
                </Tabs>
            </Box>
        </Container>
    );
}
export default NavTabs;
