import { GROUP_TABS } from "../../../global/constant";
import { useNavigate } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { Container } from "react-bootstrap";

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

    return (
        <Container>
            <Box sx={{ width: "100%" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    centered
                >
                    {GROUP_TABS.map(({ name, displayText }, index) => (
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
