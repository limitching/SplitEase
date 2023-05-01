import styled from "styled-components";
import { Container, Modal, Button, Form, Row } from "react-bootstrap";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AWS_CLOUDFRONT_HOST, GROUP_BG_COLOR } from "../../global/constant";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { api } from "../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;

const LogoutButton = styled(Button)`
    width: 5vw;
    min-width: 85px;
    height: 2.5rem;
    color: #1f39be;
`;

const SaveButton = styled(Button)`
    background-color: #f3ca40;
    border-color: #f3ca40;

    &:hover {
        background-color: #f5d67d;
        border-color: #f5d67d;
    }
`;

const ProfileModal = ({
    showProfileModal,
    handleCloseProfileModal,
    modifiedUserName,
    modifiedUserImage,
    setModifiedUserName,
    setModifiedUserImage,
}) => {
    const { user, jwtToken, logout, setJwtToken, setUser } =
        useContext(AuthContext);

    useEffect(() => {
        setModifiedUserName(user.name);
        setModifiedUserImage(user.image);
    }, [user, setModifiedUserName, setModifiedUserImage]);

    function handleUserDataChange(event) {
        setModifiedUserName(event.target.value);
    }

    const updateUser = async (event) => {
        event.preventDefault();
        const modifiedUserData = {
            name: modifiedUserName,
            image: modifiedUserImage,
        };

        const data = await api.updateProfile(jwtToken, modifiedUserData);

        if (data.errors || data.error) {
            return MySwal.fire({
                title: <p>Bad request</p>,
                html: (
                    <div>
                        {data.errors.map((error) => <p>{error.msg}</p>) ||
                            data.error}
                    </div>
                ),
                icon: "error",
                timer: 1000,
                showConfirmButton: false,
            });
        }

        MySwal.fire({
            title: <p>Update Successfully</p>,
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
        });
        setJwtToken(data.access_token);
        window.localStorage.setItem("jwtToken", data.access_token);
        setUser(data.user);

        handleCloseProfileModal();
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(user.line_binding_code).then(
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

    const handlingUpload = async (event) => {
        const imageFile = event.target.files[0];
        // get secure url from my server
        const response = await api.getPresignedUrl(jwtToken);
        if (response.error) {
            return console.error(response.error);
        }
        const presignedUrl = response.url;
        const imageName = response.imageName;
        const uploadResponse = await api.putImageToS3(presignedUrl, imageFile);
        if (uploadResponse.error) {
            return console.error(uploadResponse.error);
        }
        const imageUrl = AWS_CLOUDFRONT_HOST + imageName;
        setModifiedUserImage(imageUrl);
    };
    return (
        <>
            <Modal
                show={showProfileModal}
                onHide={handleCloseProfileModal}
                backdrop="static"
                keyboard={false}
                size="md"
                centered
            >
                <Form onSubmit={updateUser}>
                    <Modal.Header closeButton as={Row}>
                        <Container className="modal-header-text ml-0 pl-0">
                            <h4>Profile</h4>
                        </Container>
                        <LogoutButton variant="light" onClick={logout}>
                            Logout
                        </LogoutButton>
                    </Modal.Header>
                    <StyledModalBody>
                        <Container>
                            <Container
                                style={{
                                    width: "100%",
                                    height: "300px",
                                    position: "relative",
                                    backgroundColor: GROUP_BG_COLOR,
                                    padding: "0 12px",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={
                                        modifiedUserImage === null
                                            ? `${AWS_CLOUDFRONT_HOST}fbe9690656549edd75c5cdb1786d667f`
                                            : modifiedUserImage
                                    }
                                    alt=""
                                    style={{
                                        position: "absolute",
                                        top: "0",
                                        left: "0",
                                        bottom: "0",
                                        right: "0",
                                        margin: "auto",
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                    }}
                                />
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                    style={{
                                        position: "absolute",
                                        bottom: "10px",
                                        right: "10px",
                                    }}
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handlingUpload}
                                    />
                                    <PhotoCamera />
                                </IconButton>
                            </Container>
                        </Container>

                        <Container>
                            <TextField
                                name="name"
                                className="mb-3"
                                label="Name"
                                type="text"
                                variant="standard"
                                value={modifiedUserName}
                                onChange={handleUserDataChange}
                                required
                                fullWidth
                            />
                        </Container>

                        <Container>
                            <TextField
                                className="mb-3"
                                label="Email address"
                                type="text"
                                variant="standard"
                                value={user.email}
                                required
                                fullWidth
                                aria-readonly
                                disabled
                            />
                        </Container>
                        <Container>
                            <TextField
                                className="mb-3"
                                label="Line binding code"
                                type="text"
                                variant="standard"
                                value={user.line_binding_code}
                                onClick={handleCopyCode}
                                fullWidth
                                aria-readonly
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                color="primary"
                                                aria-label="upload picture"
                                                component="label"
                                            >
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Container>
                    </StyledModalBody>
                    <Modal.Footer>
                        <Container className="d-grid">
                            <SaveButton variant="warning" type="submit">
                                Save
                            </SaveButton>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};
export default ProfileModal;
