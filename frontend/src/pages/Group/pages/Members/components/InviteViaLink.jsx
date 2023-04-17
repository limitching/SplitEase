import { useState, useContext } from "react";
import styled from "styled-components";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { Button, TextField } from "@mui/material";

const InviteLinkContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const HeaderTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
`;

const InviteViaLink = () => {
    const { group, slug } = useContext(GroupContext);
    const invitation_link = `http://localhost:3001/group/${slug}/join?invitation_code=${group.invitation_code}`;
    const [link, setLink] = useState(invitation_link);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(
            () => {
                alert("Link copied to clipboard!");
            },
            () => {
                alert("Failed to copy link to clipboard!");
            }
        );
    };

    return (
        <>
            <HeaderTextContainer>Joining via link</HeaderTextContainer>
            <InviteLinkContainer>
                <TextField
                    label="Invite Link"
                    variant="outlined"
                    value={link}
                    aria-readonly
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCopyLink}
                >
                    Copy Link
                </Button>
            </InviteLinkContainer>
        </>
    );
};

export default InviteViaLink;
