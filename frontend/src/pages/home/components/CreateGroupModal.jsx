import { Container, Modal, Button, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { TextField, MenuItem } from "@mui/material";
import { CURRENCY_OPTIONS } from "../../../global/constant";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { api } from "../../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const CreateGroupModal = ({
    showCreateGroupModal,
    handleCloseCreateGroupModal,
}) => {
    const { user, jwtToken } = useContext(AuthContext);
    const [newGroupData, setNewGroupData] = useState({
        owner: user.id,
        name: "",
        default_currency: 1,
        description: "",
    });
    console.log(newGroupData);

    function handleNewGroupDataChange(event) {
        const key = event.target.name;
        setNewGroupData({ ...newGroupData, [key]: event.target.value });
    }

    const createGroup = (event) => {
        event.preventDefault();
        const errors = [];
        if (!newGroupData.owner) {
            errors.push("Owner cannot be null");
            errors.push("Please re-login again");
        }
        if (newGroupData.name.length === 0) {
            errors.push("Group Name cannot be null");
        }
        if (errors.length !== 0) {
            return MySwal.fire({
                title: <p>Request Error</p>,
                html: (
                    <div>
                        {errors.map((error) => (
                            <p>{error}</p>
                        ))}
                    </div>
                ),
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        }
    };

    return (
        <Modal
            show={showCreateGroupModal}
            onHide={handleCloseCreateGroupModal}
            backdrop="static"
            keyboard={false}
            size="md"
            centered
        >
            <Form onSubmit={createGroup}>
                <Modal.Header closeButton as={Row}>
                    <Container className="modal-header-text ml-0 pl-0">
                        <h3>Create a new group</h3>
                    </Container>
                </Modal.Header>
                <StyledModalBody>
                    <Container>
                        <TextField
                            name="name"
                            className="mb-3"
                            label="Group name"
                            type="text"
                            value={newGroupData.name}
                            onChange={handleNewGroupDataChange}
                            variant="standard"
                            fullWidth
                            required
                        />
                    </Container>
                    <Container>
                        <TextField
                            name="default_currency"
                            select
                            label="Currency for group debts"
                            value={newGroupData.default_currency}
                            onChange={handleNewGroupDataChange}
                            variant="standard"
                            fullWidth
                            required
                        >
                            {CURRENCY_OPTIONS.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {`${option.abbreviation}  (${option.symbol})`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Container>
                    <Container>
                        <TextField
                            name="description"
                            className="mb-3"
                            label="Group description"
                            type="text"
                            variant="standard"
                            value={newGroupData.description}
                            onChange={handleNewGroupDataChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Container>
                </StyledModalBody>
                <Modal.Footer>
                    <Container className="d-grid">
                        <Button variant="warning" type="submit">
                            Create a new group
                        </Button>
                    </Container>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default CreateGroupModal;
