import Box from "@mui/material/Box";
import { Container, Navbar } from "react-bootstrap";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import HelpIcon from "@mui/icons-material/Help";

import { useState } from "react";

const NestedList = () => {
    const [open, setOpen] = useState({
        Equally: false,
        "Exact amounts": false,
        Percentages: false,
        Shares: false,
        Adjustment: false,
    });

    const handleNestedClick = (key) => {
        setOpen((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Introduction of split methods
                </ListSubheader>
            }
        >
            <ListItemButton onClick={() => handleNestedClick("Equally")}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Equally" />
                {open.Equally ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.Equally} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText secondary="Select which people owe an equal share" />
                    </ListItem>
                </List>
            </Collapse>
            <ListItemButton onClick={() => handleNestedClick("Exact amounts")}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Exact amounts" />
                {open["Exact amounts"] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open["Exact amounts"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText secondary="Specify exactly how much each person owes" />
                    </ListItem>
                </List>
            </Collapse>
            <ListItemButton onClick={() => handleNestedClick("Percentages")}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Percentages" />
                {open["Percentages"] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open["Percentages"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText secondary="Enter the percentage split that's fair for your situation." />
                    </ListItem>
                </List>
            </Collapse>
            <ListItemButton onClick={() => handleNestedClick("Shares")}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Shares" />
                {open["Shares"] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open["Shares"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <List component="div" disablePadding>
                        <ListItem sx={{ pl: 4 }}>
                            <ListItemText secondary="Split the bill based on predetermined shares assigned to each participant." />
                        </ListItem>
                    </List>
                </List>
            </Collapse>
            <ListItemButton onClick={() => handleNestedClick("Adjustment")}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="Adjustment" />
                {open["Adjustment"] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open["Adjustment"]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <List component="div" disablePadding>
                        <ListItem sx={{ pl: 4 }}>
                            <ListItemText secondary="Adjust the total bill amount with a specific amount before splitting." />
                        </ListItem>
                    </List>
                </List>
            </Collapse>
        </List>
    );
};

const CurrencyNestedList = () => {
    const [open, setOpen] = useState({
        Exchange: false,
        Currency: false,
    });

    const handleNestedClick = (key) => {
        setOpen((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    return (
        <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Q & A related to currencies
                </ListSubheader>
            }
        >
            <ListItemButton onClick={() => handleNestedClick("Exchange")}>
                <ListItemIcon>
                    <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Exchange rate in SplitEase" />
                {open.Exchange ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.Exchange} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <ListItemText secondary="In SplitEase, we do not provide exchange rate conversion services, so debts in different currencies are calculated separately." />
                    </ListItem>
                </List>
            </Collapse>

            <ListItemButton onClick={() => handleNestedClick("Currency")}>
                <ListItemIcon>
                    <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="Currency type" />
                {open.Currency ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.Currency} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <ListItemText secondary="SplitEase currently provides 10 major currencies for users to select, all of which are large currencies with high liquidity and applicability." />
                            <ListItemText secondary="More currencies will be supported in the future." />
                        </div>
                    </ListItem>
                </List>
            </Collapse>
        </List>
    );
};

const splitMethodsIntro = (anchor) => (
    <Box
        sx={{
            width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
        }}
        role="presentation"
    >
        <Container
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",

                padding: "12px 16px",
            }}
        >
            <Navbar.Brand>
                <img
                    src="/assets/logo.svg"
                    width="auto"
                    height="30"
                    alt="SplitEase logo"
                />
            </Navbar.Brand>
        </Container>
        <Divider />
        <NestedList></NestedList>
    </Box>
);

const currencyIntro = (anchor) => (
    <Box
        sx={{
            width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
        }}
        role="presentation"
    >
        <Container
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",

                padding: "12px 16px",
            }}
        >
            <Navbar.Brand>
                <img
                    src="/assets/logo.svg"
                    width="auto"
                    height="30"
                    alt="SplitEase logo"
                />
            </Navbar.Brand>
        </Container>
        <Divider />
        <CurrencyNestedList></CurrencyNestedList>
    </Box>
);

export { splitMethodsIntro, currencyIntro };
