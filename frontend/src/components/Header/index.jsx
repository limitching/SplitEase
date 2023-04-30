import styled from "styled-components";
import { Container, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

import ProfileButton from "./ProfileButton";
import { HEADER_BG_COLOR } from "../../global/constant";

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
    const location = useLocation();
    const { isLogin, logout } = useContext(AuthContext);
    const { setInvitation_code } = useContext(GroupContext);
    const navigate = useNavigate();

    const [scrollPosition, setScrollPosition] = useState(0);
    const [isAtRoot, setIsAtRoot] = useState(location.pathname === "/");

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            if (currentPosition > 60) {
                const opacity = Math.min((currentPosition - 100) / 100, 1);
                console.log(document.getElementById("header"));
                document.getElementById(
                    "header"
                ).style.backgroundColor = `rgba(243,202,64,${opacity})`;
            } else {
                document.getElementById("header").style.backgroundColor =
                    "transparent";
            }

            setScrollPosition(currentPosition);
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

    return (
        <div>
            <StyledNavbar
                id="header"
                // className={isAtRoot ? "container" : undefined}
                expand="lg"
                fixed="top"
                // transparent={isAtRoot ? "true" : undefined}
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
                                <Nav.Link href="#team">Teams</Nav.Link>
                                <Nav.Link href="#blog">Blogs</Nav.Link>
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
        </div>
    );
};
export default Header;
