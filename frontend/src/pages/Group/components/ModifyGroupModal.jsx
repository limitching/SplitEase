import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Container, Modal, Button, Form, Row } from "react-bootstrap";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { CURRENCY_OPTIONS } from "../../../global/constant";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { GroupContext } from "../../../contexts/GroupContext";
import { api } from "../../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
  max-height: 800px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ModifyGroupModal = ({
  showModifyGroupModal,
  handleCloseModifyGroupModal,
  modifiedGroupData,
  setModifiedGroupData
}) => {
  const navigate = useNavigate();
  const { user, jwtToken, setGroupChange } = useContext(AuthContext);
  const { group, socket, setExpensesChanged, group_id } = useContext(GroupContext);

  const [error, setError] = useState({
    name: undefined,
    description: undefined
  });
  const [alertOpen, setAlertOpen] = useState(false);

  // const [modifiedGroupData, setModifiedGroupData] = useState({
  //     id: group.id,
  //     name: group.name,
  //     default_currency: group.default_currency,
  //     description: group.description,
  //     minimized_debts: Number(group.minimized_debts),
  // });
  // console.log("group", group);
  // console.log("modal", modifiedGroupData);
  // console.log("value", Boolean(modifiedGroupData.minimized_debts));

  // useEffect(() => {
  //     setModifiedGroupData({
  //         id: group.id,
  //         name: group.name,
  //         default_currency: group.default_currency,
  //         description: group.description,
  //         minimized_debts: Number(group.minimized_debts),
  //     });
  // }, [group]);

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChecked = () => {
    if (Boolean(modifiedGroupData.minimized_debts)) {
      setModifiedGroupData({
        ...modifiedGroupData,
        minimized_debts: Number(false)
      });
    } else {
      setModifiedGroupData({
        ...modifiedGroupData,
        minimized_debts: Number(true)
      });
    }
  };

  function handleGroupDataChange(event) {
    const key = event.target.name;
    const newError = { ...error };
    if (key === "name") {
      if (event.target.value.length > 50) {
        newError.name = "Group name must less than 50 characters.";
      } else {
        newError.name = undefined;
      }
    }
    if (key === "description") {
      console.log(event.target.value);
      if (event.target.value.length > 50) {
        newError.description = "Group description must less than 50 characters.";
      } else {
        newError.description = undefined;
      }
    }
    setError(newError);
    setModifiedGroupData({
      ...modifiedGroupData,
      [key]: event.target.value
    });
  }

  const editGroup = async event => {
    event.preventDefault();
    const errors = [];
    if (!modifiedGroupData.id) {
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
            {errors.map(error => (
              <p>{error}</p>
            ))}
          </div>
        ),
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });
    }

    const response = await api.editGroup(jwtToken, modifiedGroupData, group_id);
    if (response.data.errors || response.status !== 200) {
      return MySwal.fire({
        title: <p>Request Error</p>,
        html: (
          <div>
            {response.data.errors ? (
              response.data.errors.map(error => <p>{error.msg}</p>)
            ) : (
              <p>Error {response.status}</p>
            )}
          </div>
        ),
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });
    }

    MySwal.fire({
      title: <p>Update Group Successfully</p>,
      html: (
        <div>
          <p>Group name: {response.data.name}</p>
        </div>
      ),
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
    setModifiedGroupData({
      owner: user.id,
      name: "",
      default_currency: 1,
      description: ""
    });
    handleCloseModifyGroupModal();

    if (socket.connected) {
      // socket.emit("logsChange");
      socket.emit("expenseChange");
    } else {
      setExpensesChanged(true);
    }
    setGroupChange(true);
  };

  const handleGroupArchive = async () => {
    handleAlertClose();
    const response = await api.archiveGroup(jwtToken, group.id);

    setGroupChange(true);
    // handleClickVariant("Expense Created successfully!", "success");
    MySwal.fire({
      title: <p>{response.data.msg}</p>,
      icon: "success",
      timer: 1000,
      showConfirmButton: false
    });
    navigate("/home");
  };
  // console.log(typeof modifiedGroupData.minimized_debts);
  // console.log(Boolean(0));

  return (
    <>
      <Modal
        show={showModifyGroupModal}
        onHide={handleCloseModifyGroupModal}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        <Form onSubmit={editGroup}>
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
                onChange={handleGroupDataChange}
                variant="standard"
                fullWidth
                required
                helperText={error.name}
                error={Boolean(error.name)}
              />
            </Container>
            <Container>
              <TextField
                name="default_currency"
                select
                label="Default currency for group debts"
                value={modifiedGroupData.default_currency}
                onChange={handleGroupDataChange}
                variant="standard"
                fullWidth
                required
              >
                {CURRENCY_OPTIONS.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {`${option.abbreviation}  (${option.symbol})`}
                  </MenuItem>
                ))}
              </TextField>
            </Container>

            <Container>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(modifiedGroupData.minimized_debts)}
                    onChange={event => {
                      handleChecked(event);
                    }}
                  />
                }
                label={"Minimize the number of group debts"}
              />
            </Container>
            <Container>
              <TextField
                name="description"
                className="mb-3"
                label="Group description"
                type="text"
                variant="standard"
                value={modifiedGroupData.description}
                onChange={handleGroupDataChange}
                fullWidth
                multiline
                rows={3}
                helperText={error.description}
                error={Boolean(error.description)}
              />
            </Container>
            {user.id === group.owner ? (
              <Container>
                <MuiButton variant="outlined" onClick={handleAlertOpen}>
                  Archive group
                </MuiButton>
              </Container>
            ) : null}
          </StyledModalBody>
          <Modal.Footer>
            <Container className="d-grid">
              <Button variant="warning" type="submit" disabled={error.name || error.description}>
                {error.name || error.description ? "Invalid Input" : "Save"}
              </Button>
            </Container>
          </Modal.Footer>
        </Form>
      </Modal>
      <Dialog
        open={alertOpen}
        onClose={handleAlertClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Archive Group"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>Do you wish to archive this group?</strong>
            <br />
            When a group is archived, anything related to the group cannot be edited.
            <br />
            Group owner can always restore it from the your Groups screen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleAlertClose}>Cancel</MuiButton>
          <MuiButton onClick={() => handleGroupArchive()} autoFocus>
            Archive
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ModifyGroupModal;
