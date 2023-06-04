import styled from "styled-components";
import { Container, Modal, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import { ModalContent } from "./Modal";
import { useContext, useState } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../../../../../utils/api";
import { SPLIT_METHODS, HEADER_BG_COLOR } from "../../../../../global/constant";
import { AuthContext } from "../../../../../contexts/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
  // height: 57vh;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ModalHeader = styled.h5`
  margin-bottom: 0px;
`;

const ExpenseModificationModal = () => {
  const { memberMap, group_id, members, socket, setExpensesChanged } = useContext(GroupContext);
  const {
    checked,
    subValues,
    subCredit,
    amount,
    selectedCreditor,
    selectedSplitMethod,
    selectedExpense,
    showModification,
    expenseTime,
    setShowModification
  } = useContext(ExpenseContext);
  const { jwtToken } = useContext(AuthContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleClose = () => setShowModification(false);

  const handleExpenseUpdate = async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const creditors = [selectedCreditor];
    const creditorsAmounts = new Map();
    if (selectedCreditor !== "multi") {
      creditorsAmounts.set(creditors[0], Number(amount));
    } else {
      subCredit.forEach((credit, creditorIndex) => {
        creditorsAmounts.set(members[creditorIndex].id, Number(credit));
      });
    }
    const debtorsWeight = new Map();
    const debtorsAdjustment = new Map();

    if (selectedSplitMethod === 0) {
      checked.forEach(debtor => debtorsWeight.set(debtor.id, 1));
    } else if (selectedSplitMethod === 1 || selectedSplitMethod === 2 || selectedSplitMethod === 3) {
      subValues.forEach((debtorAmount, debtorIndex) => {
        if (debtorAmount !== 0) {
          // TODO: Error Client side error but mongodb error
          // console.log(members[debtorIndex].id);
          // debtorsWeight.set(memberMap.get(debtorIndex), debtorAmount);
          debtorsWeight.set(members[debtorIndex].id, debtorAmount);
        }
      });
    } else if (selectedSplitMethod === 4) {
      subValues.forEach((debtorAmount, debtorIndex) => {
        debtorsWeight.set(members[debtorIndex].id, 1);
        debtorsAdjustment.set(members[debtorIndex].id, debtorAmount);
      });
    }
    formData.append("expense_id", selectedExpense._id);
    formData.append("split_method", SPLIT_METHODS[selectedSplitMethod]);
    formData.append("attached_group_id", group_id);
    formData.append("creditors", JSON.stringify(memberMap.get(Number(selectedCreditor))));
    formData.append("creditorsAmounts", JSON.stringify([...creditorsAmounts]));
    formData.append("debtorsWeight", JSON.stringify([...debtorsWeight]));

    const localExpenseTime = expenseTime;
    const utcExpenseTime = dayjs(localExpenseTime).utcOffset(0).format("YYYY-MM-DDTHH:mm");
    // console.log(utcExpenseTime);

    formData.append("date", utcExpenseTime);
    if (selectedSplitMethod === 4) {
      formData.append("debtorsAdjustment", JSON.stringify([...debtorsAdjustment]));
    }

    //TODO: debug;
    // for (const pair of formData.entries()) {
    //     console.log(`${pair[0]}, ${pair[1]}`);
    // }

    const response = await api.updateExpense(formData, jwtToken);
    if (response.status === 200) {
      if (socket.connected) {
        socket.emit("expenseChange");
      } else {
        setExpensesChanged(true);
      }

      // handleClickVariant("Expense Created successfully!", "success");
      MySwal.fire({
        title: <p>{response.data.msg}</p>,
        icon: "success",
        timer: 1000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
      handleClose();
    } else if (response.status === 400) {
      MySwal.fire({
        title: <p>Client Side Error</p>,
        html: <p>{response.data.errors[0].msg}</p>,
        icon: "error",
        timer: 2000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
    } else if (response.status === 500) {
      MySwal.fire({
        title: <p>Server Side Error</p>,
        html: <p>{response.data.error}</p>,
        icon: "error",
        timer: 2000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
    }
  };

  const handleExpenseDelete = async (expense_id, group_id) => {
    handleAlertClose();
    const response = await api.deleteExpense(expense_id, group_id, jwtToken);
    if (response.status === 200) {
      if (socket.connected) {
        socket.emit("expenseChange");
      } else {
        setExpensesChanged(true);
      }
      // handleClickVariant("Expense Created successfully!", "success");
      MySwal.fire({
        title: <p>{response.data.msg}</p>,
        icon: "success",
        timer: 1000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
      handleClose();
    } else if (response.status === 400) {
      MySwal.fire({
        title: <p>CLient Side Error</p>,
        html: <p>{response.data.error}</p>,
        icon: "error",
        timer: 2000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
    } else if (response.status === 500) {
      MySwal.fire({
        title: <p>Server Side Error</p>,
        html: <p>{response.data.error}</p>,
        icon: "error",
        timer: 2000,
        didOpen: () => {
          // `MySwal` is a subclass of `Swal` with all the same instance & static methods
          MySwal.showLoading();
        }
      });
    }
  };

  if (selectedCreditor !== "multi") {
    return (
      <>
        <Modal show={showModification} onHide={handleClose} backdrop="static" keyboard={false} centered>
          <Form onSubmit={handleExpenseUpdate}>
            <Modal.Header closeButton as={Row}>
              <Container
                as={Row}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                  width: "100%"
                }}
              >
                <Col lg="6" sm="6" xs="6">
                  <ModalHeader>Expense detail</ModalHeader>
                </Col>
                <Col
                  lg="6"
                  sm="6"
                  xs="6"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleAlertOpen}
                    disabled={(selectedExpense?.status ?? "") === "settled" ? true : false}
                    disableElevation
                  >
                    {(selectedExpense?.status ?? "") === "settled" ? "Already settled" : "Delete"}
                  </Button>
                </Col>
              </Container>
            </Modal.Header>
            <StyledModalBody>
              <ModalContent hasError={hasError} setHasError={setHasError} />
            </StyledModalBody>
            <Modal.Footer>
              <Container className="d-grid">
                <Button
                  variant="contained"
                  type="submit"
                  disabled={amount === 0 || (selectedExpense?.status ?? "") === "settled" || hasError}
                  disableElevation
                  sx={{
                    backgroundColor: HEADER_BG_COLOR,
                    "&:hover": {
                      backgroundColor: "#cdae21"
                    }
                  }}
                >
                  {(selectedExpense?.status ?? "") === "settled"
                    ? "This Expense is already settled"
                    : hasError
                    ? "Invalid Input"
                    : "Update"}
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
          <DialogTitle id="alert-dialog-title">{"Delete Expense"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you wish to delete this expense?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose}>Keep</Button>
            <Button
              onClick={() => handleExpenseDelete(selectedExpense._id, group_id)}
              autoFocus
              disabled={(selectedExpense?.status ?? "") === "settled" ? true : false}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Modal show={showModification} onHide={handleClose} backdrop="static" keyboard={false} size="xl" centered>
          <Form onSubmit={handleExpenseUpdate}>
            <Modal.Header closeButton as={Row}>
              <Container className="transaction-method ml-0 pl-0">
                <Col lg="6">
                  <ModalHeader>Expense detail</ModalHeader>
                </Col>
              </Container>
            </Modal.Header>
            <StyledModalBody>
              <ModalContent hasError={hasError} setHasError={setHasError} />
            </StyledModalBody>
            <Modal.Footer>
              <Container className="d-grid">
                <Button
                  variant="outlined"
                  onClick={handleAlertOpen}
                  className="mb-3"
                  disabled={(selectedExpense?.status ?? "") === "settled" ? true : false}
                  disableElevation
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className="mb-3"
                  disabled={amount === 0 || (selectedExpense?.status ?? "") === "settled" || hasError}
                  disableElevation
                  sx={{
                    backgroundColor: HEADER_BG_COLOR,
                    "&:hover": {
                      backgroundColor: "#cdae21"
                    }
                  }}
                >
                  Update
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
          <DialogTitle id="alert-dialog-title">{"Delete Expense"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you wish to delete this expense?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose}>Keep</Button>
            <Button
              onClick={() => handleExpenseDelete(selectedExpense._id, group_id)}
              autoFocus
              disabled={(selectedExpense?.status ?? "") === "settled" ? true : false}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};

export default ExpenseModificationModal;
