import styled from "styled-components";
import { Container, Button, Nav, Navbar, NavDropdown } from "react-bootstrap";

const StyledNavbar = styled(Navbar)`
    height: 5vh;
`;
const StyledContainer = styled(Container)`
    display: flex;
    align-items: space-between;
    @media (min-width: 1400px) {
        max-width: 95vw;
    }
`;
const StyledButton = styled(Button)`
    width: 5vw;
    min-width: 85px;
`;

const Header = () => {
    return (
        <StyledNavbar bg="warning" expand="lg" fixed="top">
            <StyledContainer>
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
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
                    <Nav>
                        <StyledButton variant="success">Register</StyledButton>
                        <span style={{ marginRight: "10px" }}></span>
                        <StyledButton variant="light">Login</StyledButton>
                    </Nav>
                </Navbar.Collapse>
            </StyledContainer>
        </StyledNavbar>
    );
};
export default Header;
