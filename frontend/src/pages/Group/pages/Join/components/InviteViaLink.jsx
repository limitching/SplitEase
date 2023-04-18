import { useState, useContext } from "react";
import styled from "styled-components";
import { GroupContext } from "../../../../../contexts/GroupContext";
import {
    Button as NormalButton,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip,
} from "@mui/material";
import Button from "@mui/material-next/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import { FixedButtonWrapper } from "../../../components/PageWrapper";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const InvitationMethodContainer = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const CheckboxContainer = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 1rem;
`;

const HeaderTextContainer = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-top: 1rem;
`;

const InviteViaLink = () => {
    const { group, slug, inviteEmail, setInviteEmail } =
        useContext(GroupContext);
    const invitation_link = `http://localhost:3001/group/${slug}/join?invitation_code=${group.invitation_code}`;
    const [link, setLink] = useState(invitation_link);
    const [isCheck, setIsCheck] = useState(true);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(
            () => {
                // alert("Link copied to clipboard!");
                MySwal.fire({
                    title: <p>Link copied to clipboard</p>,
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                });
            },
            () => {
                MySwal.fire({
                    title: <p>Failed to copy link to clipboard!</p>,
                    icon: "error",
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        );
    };

    const handleInviteEmailChange = (event) => {
        setInviteEmail(event.target.value);
    };

    const handleChecked = (event) => {
        if (isCheck) {
            setIsCheck(false);
        } else {
            setIsCheck(true);
        }
    };

    // TODO:
    // function emailIsValid(email) {
    //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // }

    return (
        <>
            <HeaderTextContainer>
                <h6>Invite via link</h6>
            </HeaderTextContainer>
            <CheckboxContainer>
                <FormControlLabel
                    control={
                        <Checkbox checked={isCheck} onChange={handleChecked} />
                    }
                    label={
                        isCheck
                            ? "Anyone with the link can join this group"
                            : "Joining this group via link is disabled"
                    }
                />
            </CheckboxContainer>
            <InvitationMethodContainer>
                <TextField
                    variant="outlined"
                    value={link}
                    fullWidth
                    aria-readonly
                    onClick={handleCopyLink}
                />
                <Tooltip title="Copy to clipboard">
                    <IconButton onClick={handleCopyLink}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </InvitationMethodContainer>
            <HeaderTextContainer>
                <h6>Invite via email</h6>
            </HeaderTextContainer>
            <InvitationMethodContainer>
                <TextField
                    variant="outlined"
                    type="email"
                    value={inviteEmail}
                    required
                    fullWidth
                    onChange={handleInviteEmailChange}
                />
                <NormalButton
                    variant="outlined"
                    size="large"
                    endIcon={<SendIcon></SendIcon>}
                >
                    Invite
                </NormalButton>
            </InvitationMethodContainer>
            <FixedButtonWrapper>
                <Button
                    color="primary"
                    disabled={false}
                    size="large"
                    variant="filled"
                    startIcon={<ShareIcon></ShareIcon>}
                    onClickCapture={handleCopyLink}
                >
                    SHARE LINK
                </Button>
            </FixedButtonWrapper>
        </>
    );
};

export default InviteViaLink;