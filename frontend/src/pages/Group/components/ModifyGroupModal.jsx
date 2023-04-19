import { Container, Modal, Button, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { TextField, MenuItem } from "@mui/material";
import { CURRENCY_OPTIONS } from "../../../global/constant";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { GroupContext } from "../../../contexts/GroupContext";
import { api } from "../../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const ModifyGroupModal = ({
    showModifyGroupModal,
    handleCloseModifyGroupModal,
}) => {
    const { user, jwtToken, setLoading, setGroupChange } =
        useContext(AuthContext);
    const { group } = useContext(GroupContext);
    console.log("group", group);

    const [modifiedGroupData, setModifiedGroupData] = useState({
        owner: group.owner,
        name: group.name,
        default_currency: group.default_currency,
        description: group.description,
    });

    useEffect(() => {
        setModifiedGroupData({
            owner: group.owner,
            name: group.name,
            default_currency: group.default_currency,
            description: group.description,
        });
    }, [group]);

    function handleNewGroupDataChange(event) {
        const key = event.target.name;
        setModifiedGroupData({
            ...modifiedGroupData,
            [key]: event.target.value,
        });
    }

    const createGroup = async (event) => {
        event.preventDefault();
        const errors = [];
        if (!modifiedGroupData.owner) {
            errors.push("Owner cannot be null");
            errors.push("Please re-login again");
        }
        if (modifiedGroupData.name.length === 0) {
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
        setLoading(true);
        const response = await api.editGroup(jwtToken, modifiedGroupData);
        console.log(response);
        if (response.data.errors || response.status !== 200) {
            console.log("hello");
            setLoading(false);
            return MySwal.fire({
                title: <p>Request Error</p>,
                html: (
                    <div>
                        {response.data.errors ? (
                            response.data.errors.map((error) => (
                                <p>{error.msg}</p>
                            ))
                        ) : (
                            <p>Error {response.status}</p>
                        )}
                    </div>
                ),
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        }

        MySwal.fire({
            title: <p>Create Group Successfully</p>,
            html: (
                <div>
                    <p>Group name: {response.data.name}</p>
                </div>
            ),
            icon: "success",
            timer: 2000,
            didOpen: () => {
                MySwal.showLoading();
            },
        });
        setModifiedGroupData({
            owner: user.id,
            name: "",
            default_currency: 1,
            description: "",
        });
        handleCloseModifyGroupModal();
        setGroupChange(true);
        setLoading(false);
    };

    return (
        <Modal
            show={showModifyGroupModal}
            onHide={handleCloseModifyGroupModal}
            backdrop="static"
            keyboard={false}
            size="md"
            centered
        >
            <Form onSubmit={createGroup}>
                <Modal.Header closeButton as={Row}>
                    <Container className="modal-header-text ml-0 pl-0">
                        <h3>Edit group</h3>
                    </Container>
                </Modal.Header>
                <StyledModalBody>
                    <Container>
                        <TextField
                            name="name"
                            className="mb-3"
                            label="Group name"
                            type="text"
                            value={modifiedGroupData.name}
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
                            label="Default currency for group debts"
                            value={modifiedGroupData.default_currency}
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
                            value={modifiedGroupData.description}
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
                            Save
                        </Button>
                    </Container>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default ModifyGroupModal;
