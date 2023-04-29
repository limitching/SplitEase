import styled from "styled-components";
import { Container, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";
import { Link, useNavigate } from "react-router-dom";

import ProfileButton from "./ProfileButton";
import { HEADER_BG_COLOR } from "../../global/constant";

const StyledNavbar = styled(Navbar)`
    height: 55px;
    padding: 0;
    width: 100vw;
    background-color: ${(props) =>
        props.transparent ? "transparent" : HEADER_BG_COLOR};
`;
const StyledContainer = styled(Container)`
    display: flex;
    flex-wrap: no-wrap;
    justify-content: space-around;
    width: 100%;
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

const Header = () => {
    const { isLogin, logout } = useContext(AuthContext);
    const { setInvitation_code } = useContext(GroupContext);
    const navigate = useNavigate();

    const handleStartClick = () => {
        if (window.location.href.includes("group")) {
            localStorage.setItem("lastPageUrl", window.location.href);
        }
        setInvitation_code(null);
        navigate("/login");
    };

    // Check if at root
    const isAtRoot = window.location.pathname === "/";

    return (
        <>
            <StyledNavbar
                expand="lg"
                fixed="top"
                transparent={isAtRoot.toString()}
            >
                <StyledContainer>
                    <div>
                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            style={{ border: "none", maxWidth: "54px" }}
                        />
                        <StyledLink to={isLogin ? "/home" : "/"}>
                            <Navbar.Brand>
                                <img
                                    src="/assets/logo.svg"
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
                                <Nav.Link href="#pricing">Pricing</Nav.Link>
                                <NavDropdown
                                    title="Dropdown"
                                    id="collasible-nav-dropdown"
                                >
                                    <NavDropdown.Item href="#action/3.1">
                                        Action
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Another action
                                    </NavDropdown.Item>
                                    er
                                    <NavDropdown.Item href="#action/3.3">
                                        Something
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">
                                        Separated link
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    )}

                    {isLogin ? (
                        <StyledNav>
                            <ProfileButton></ProfileButton>
                            <StyledButton variant="light" onClick={logout}>
                                Logout
                            </StyledButton>
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
        </>
    );
};
export default Header;
