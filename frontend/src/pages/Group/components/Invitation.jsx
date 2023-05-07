import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GroupContext } from "../../../contexts/GroupContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { Button } from "react-bootstrap";

const StyledButton = styled(Button)`
    background-color: #f3ca40;
    border: none;
    color: #fff;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #e0b731;
        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    }
`;

const WrapperRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    // border: 1px solid blue;
`;

const WrapperInvitationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    // border: 1px solid blue;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: center;
        width: 80%;
    }
`;

const InvitationContext = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    // border: 1px solid black;
    text-align: center;
    padding: 1rem;
    flex: 1;

    @media (min-width: 768px) {
        flex: 1;
        height: auto;
        text-align: left;
        padding: 2rem;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;
    height: 100%;
    // border: 1px solid black;
    padding: 1rem;
    width: 100%;
    flex: 1;
    @media (min-width: 768px) {
        flex: 1.5;
        height: auto;
        padding: 2rem;
        align-items: start;
    }
`;

const InvitationImg = styled.img`
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    min-width: 100%;
    flex: 1;
    @media (min-width: 768px) {
        margin-top: 0;
        margin-bottom: 0;
    }
`;

const Invitation = () => {
    const { group, slug, invitation_code, setInvitation_code, joinGroup } =
        useContext(GroupContext);
    const { isLogin, jwtToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleJoinGroup = () => {
        if (!isLogin) {
            if (window.location.href.includes("group")) {
                localStorage.setItem("lastPageUrl", window.location.href);
            }
            setInvitation_code(null);
            navigate("/login");
        } else {
            joinGroup(slug, invitation_code, jwtToken);
        }
    };

    return (
        <WrapperRow>
            <WrapperInvitationContainer>
                <InvitationContext>
                    <h1>You've been invite to join</h1>
                    <h1>
                        <strong>{group.name}</strong>
                    </h1>
                    <br />
                    <p>
                        Join the group to start your journey in{" "}
                        <strong>SplitEase</strong>!
                    </p>
                    <br />
                    <StyledButton
                        onClick={(event) => {
                            handleJoinGroup();
                        }}
                    >
                        Join Group
                    </StyledButton>
                </InvitationContext>
                <ImageContainer>
                    <InvitationImg
                        src="/assets/invite-animate.svg"
                        alt="Invitation_picture"
                    />
                </ImageContainer>
            </WrapperInvitationContainer>
        </WrapperRow>
    );
};

export default Invitation;
