import { GROUP_TABS, GROUP_TABS_VISITORS } from "../../../global/constant";
import { useNavigate } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { useState, useContext } from "react";
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
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { group } = useContext(GroupContext);
    const { userGroups } = useContext(AuthContext);

    const filterResult = userGroups.filter(
        (userGroup) => userGroup.id === group.id
    );

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
