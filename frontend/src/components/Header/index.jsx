import styled from "styled-components";
import { Container, Button, Nav, Navbar } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Divide as Hamburger } from "hamburger-react";
import GroupsIcon from "@mui/icons-material/Groups";
// import HistoryIcon from "@mui/icons-material/History";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Box from "@mui/material/Box";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ProfileButton from "./ProfileButton";
import { HEADER_BG_COLOR, CHART_COLOR } from "../../global/constant";

const StyledNavbar = styled(Navbar)`
    height: 55px;
    padding: 0;
    width: calc(100vw);
    background-color: ${(props) =>
        props.transparent ? "transparent" : HEADER_BG_COLOR};
`;
const StyledContainer = styled(Container)`
    display: flex;
    flex-wrap: no-wrap;
    justify-content: space-around;
    width: calc(100% - 80px);
    align-items: space-around;
    @media (min-width: 1400px) {
        max-width: 95vw;
    }
`;
const StyledButton = styled(Button)`
    width: 5vw;
    min-width: 85px;
    height: 2.5rem;
    @media (max-width: 767px) {
        display: none;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const StyledNav = styled(Nav)`
    display: flex;
    justify-context: center;
    align-items: center;
`;

const GroupLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const Header = () => {
    const location = useLocation();
    const { isLogin, userGroups } = useContext(AuthContext);

    // const { logout } = useContext(AuthContext);
    const { setInvitation_code } = useContext(GroupContext);
    const navigate = useNavigate();

    const [isAtRoot, setIsAtRoot] = useState(location.pathname === "/");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            if (currentPosition > 60) {
                const opacity = Math.min((currentPosition - 100) / 100, 1);
                document.getElementById(
                    "header"
                ).style.backgroundColor = `rgba(243,202,64,${opacity})`;
            } else {
                document.getElementById("header").style.backgroundColor =
                    "transparent";
            }
        };
        if (isAtRoot) {
            window.addEventListener("scroll", handleScroll);

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        } else {
            document.getElementById(
                "header"
            ).style.backgroundColor = `rgb(243,202,64)`;
        }
    }, [isAtRoot]);

    useEffect(() => {
        setIsAtRoot(location.pathname === "/");
    }, [location]);

    const handleStartClick = () => {
        if (window.location.href.includes("group")) {
            localStorage.setItem("lastPageUrl", window.location.href);
        }
        setInvitation_code(null);
        navigate("/login");
    };

    const list = (anchor) => (
        <Box
            sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 300,
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
                <StyledLink to={"/"} onClick={() => setMenuOpen(false)}>
                    <Navbar.Brand>
                        <img
                            src="/assets/images/logo.svg"
                            width="auto"
                            height="30"
                            alt="SplitEase logo"
                        />
                    </Navbar.Brand>
                </StyledLink>
            </Container>
            <Divider />

            <List>
                <StyledLink to={"/home"} onClick={() => setMenuOpen(false)}>
                    <ListItem alignItems="center" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Groups" />
                        </ListItemButton>
                    </ListItem>
                </StyledLink>

                {userGroups.map((group, index) => (
                    <GroupLink
                        key={group.slug}
                        to={`/group/${group.slug}/expenses`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <ListItem alignItems="center" disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FiberManualRecordIcon
                                        style={{ color: CHART_COLOR[index] }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${group.name}`}
                                    primaryTypographyProps={{
                                        fontSize: "1rem",
                                    }}
                                    // sx={[{ color: "blue" }]}
                                />
                            </ListItemButton>
                        </ListItem>
                    </GroupLink>
                ))}
            </List>
            <Divider />
            {/* <List>
                <ListItem>
                    <ListItemIcon>
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Archived Groups" />
                </ListItem>
                {userGroups.map((group, index) => (
                    <GroupLink
                        key={group.slug}
                        to={`/group/${group.slug}/expenses`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <ListItem alignItems="center" disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FiberManualRecordIcon
                                        style={{ color: CHART_COLOR[index] }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${group.name}`}
                                    primaryTypographyProps={{
                                        fontSize: "1rem",
                                    }}
                                    // sx={[{ color: "blue" }]}
                                />
                            </ListItemButton>
                        </ListItem>
                    </GroupLink>
                ))}
            </List> */}
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor={"left"}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
            >
                {list("left")}
            </Drawer>
            <StyledNavbar
                id="header"
                // className={isAtRoot ? "container" : undefined}
                expand="lg"
                fixed="top"
                // transparent={isAtRoot ? "true" : undefined}
                style={{ flexWrap: "no-wrap" }}
            >
                {isLogin && (
                    <div style={{ padding: "4px 1rem" }}>
                        <Hamburger
                            style={{ padding: "0" }}
                            onToggle={(toggled) => {
                                // console.log(toggled);
                                setMenuOpen(toggled);
                                // handleToggleHamburger(toggled);
                            }}
                            toggled={menuOpen}
                        ></Hamburger>
                    </div>
                )}

                <StyledContainer>
                    <div>
                        {/* <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            style={{ border: "none", maxWidth: "54px" }}
                        /> */}

                        {/* <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            style={{ border: "none", maxWidth: "54px" }}
                        /> */}

                        <StyledLink to={"/"}>
                            <Navbar.Brand>
                                <img
                                    src="/assets/images/logo.svg"
                                    width="auto"
                                    height="30"
                                    alt="SplitEase logo"
                                />
                            </Navbar.Brand>
                        </StyledLink>
                    </div>

                    {isLogin ? null : (
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#features">Features</Nav.Link>
                                <Nav.Link href="#team">Teams</Nav.Link>
                                <Nav.Link href="#blog">Blogs</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    )}

                    {isLogin ? (
                        <StyledNav>
                            <ProfileButton></ProfileButton>
                            {/* <StyledButton variant="light" onClick={logout}>
                                Logout
                            </StyledButton> */}
                        </StyledNav>
                    ) : (
                        <StyledNav>
                            <StyledButton
                                variant="light"
                                onClick={handleStartClick}
                            >
                                Start
                            </StyledButton>
                        </StyledNav>
                    )}
                </StyledContainer>
            </StyledNavbar>
        </div>
    );
};
export default Header;
