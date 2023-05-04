import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import { HEADER_BG_COLOR } from "../../global/constant";

const StyledNavbar = styled(Navbar)`
    height: 55px;
    padding: 0;
    background-color: ${HEADER_BG_COLOR};
    width: 100vw;
`;

const Footer = () => {
    const location = useLocation();
    const isHome = location.pathname === "/home";
    const isLogin = location.pathname === "/login";
    return (
        <StyledNavbar expand="lg" fixed={isHome || isLogin ? "bottom" : false}>
            <Container className="justify-content-md-center">
                {/* <Navbar.Brand href="#home">
                    <img
                        src="/assets/logo.svg"
                        width="auto"
                        height="30"
                        alt="SplitEase logo"
                    />
                </Navbar.Brand> */}

                <div className="text-center p-3">
                    © 2023 Copyright:
                    <a
                        className="text-black"
                        href="https://github.com/limitching"
                    >
                        Limitching
                    </a>
                </div>
                {/* <div className="footer__social-media">
                    <div className="footer__social-media-line" />
                    <div className="footer__social-media-twitter" />
                    <div className="footer__social-media-facebook" />
                </div> */}
            </Container>
        </StyledNavbar>
    );
};
export default Footer;
