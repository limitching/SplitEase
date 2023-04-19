import styled from "styled-components";
import { Container, Navbar } from "react-bootstrap";

const StyledNavbar = styled(Navbar)`
    height: 5vh;
`;

const Footer = () => {
    return (
        <StyledNavbar bg="warning" expand="lg" fixed="bottom">
            <Container className="justify-content-md-center">
                <Navbar.Brand href="#home">
                    <img
                        src="/logo192.png"
                        width="30"
                        height="30"
                        alt="SplitEase logo"
                    />
                    <span style={{ marginRight: "10px" }}></span>
                    SplitEase
                </Navbar.Brand>

                <div className="text-center p-3">
                    © 2023 Copyright:
                    <a
                        className="text-black"
                        href="https://github.com/limitching"
                    >
                        Limitching
                    </a>
                </div>
                <div className="footer__social-media">
                    <div className="footer__social-media-line" />
                    <div className="footer__social-media-twitter" />
                    <div className="footer__social-media-facebook" />
                </div>
            </Container>
        </StyledNavbar>
    );
};
export default Footer;
