import styled from "styled-components";
import { Container, Navbar } from "react-bootstrap";
import { HEADER_BG_COLOR } from "../../global/constant";

const StyledNavbar = styled(Navbar)`
    height: 55px;
    padding: 0;
    background-color: ${HEADER_BG_COLOR};
    width: 100vw;
    @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        bottom: auto;
    }
`;

const Footer = () => {
    return (
        <StyledNavbar expand="lg" fixed="bottom">
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
