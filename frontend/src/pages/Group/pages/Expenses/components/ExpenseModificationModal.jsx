import styled from "styled-components";
import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { ExpenseContext } from "../../../../../contexts/ExpenseContext";
import { ModalContent } from "./Modal";
import { useContext, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../../../../../utils/api";
import { SPLIT_METHODS } from "../../../../../global/constant";

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    height: 700px;
    overflow: scroll;
`;

const ExpenseModificationModal = () => {
    const { memberMap, group_id, setExpensesChanged, members } =
        useContext(GroupContext);
    const {
        checked,
        subValues,
        subCredit,
        amount,
        selectedCreditor,
        selectedSplitMethod,
        selectedExpense,
        showModification,
        setShowModification,
    } = useContext(ExpenseContext);

    const [alertOpen, setAlertOpen] = useState(false);

    const handleAlertOpen = () => {
        setAlertOpen(true);
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleClose = () => setShowModification(false);

    const handleExpenseUpdate = async (event) => {
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
            checked.forEach((debtor) => debtorsWeight.set(debtor.id, 1));
        } else if (
            selectedSplitMethod === 1 ||
            selectedSplitMethod === 2 ||
            selectedSplitMethod === 3
        ) {
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
        formData.append(
            "creditors",
            JSON.stringify(memberMap.get(Number(selectedCreditor)))
        );
        formData.append(
            "creditorsAmounts",
            JSON.stringify([...creditorsAmounts])
        );
        formData.append("debtorsWeight", JSON.stringify([...debtorsWeight]));
        if (selectedSplitMethod === 4) {
            formData.append(
                "debtorsAdjustment",
                JSON.stringify([...debtorsAdjustment])
            );
        }

        //TODO: debug;
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }

        const response = await api.updateExpense(formData);
        if (response.status === 200) {
            setExpensesChanged(true);
            // handleClickVariant("Expense Created successfully!", "success");
            MySwal.fire({
                title: <p>{response.data.msg}</p>,
                icon: "success",
                timer: 1000,
                didOpen: () => {
                    // `MySwal` is a subclass of `Swal` with all the same instance & static methods
                    MySwal.showLoading();
                },
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
                },
            });
        } else if (response.status === 500) {
            MySwal.fire({
                title: <p>Server Side Error</p>,
                html: <p>{response.data.errors[0].msg}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    // `MySwal` is a subclass of `Swal` with all the same instance & static methods
                    MySwal.showLoading();
                },
            });
        }
    };

    const handleExpenseDelete = async (expense_id, group_id) => {
        handleAlertClose();
        console.log(expense_id);
        const response = await api.deleteExpense(expense_id, group_id);
        if (response.status === 200) {
            setExpensesChanged(true);
            // handleClickVariant("Expense Created successfully!", "success");
            MySwal.fire({
                title: <p>{response.data.msg}</p>,
                icon: "success",
                timer: 1000,
                didOpen: () => {
                    // `MySwal` is a subclass of `Swal` with all the same instance & static methods
                    MySwal.showLoading();
                },
            });
            handleClose();
        } else if (response.status === 400) {
            MySwal.fire({
                title: <p>CLient Side Error</p>,
                html: <p>{response.data.errors[0].msg}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    // `MySwal` is a subclass of `Swal` with all the same instance & static methods
                    MySwal.showLoading();
                },
            });
        } else if (response.status === 500) {
            MySwal.fire({
                title: <p>Server Side Error</p>,
                html: <p>{response.data.errors[0].msg}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    // `MySwal` is a subclass of `Swal` with all the same instance & static methods
                    MySwal.showLoading();
                },
            });
        }
    };
    if (selectedCreditor !== "multi") {
        return (
            <>
                <Modal
                    show={showModification}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Form onSubmit={handleExpenseUpdate}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    <h3>Expense detail</h3>
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="light"
                                    onClick={handleAlertOpen}
                                    className="mb-3"
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="warning"
                                    type="submit"
                                    className="mb-3"
                                    disabled={amount === 0}
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
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Expense"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you wish to delete this transaction?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAlertClose}>Keep</Button>
                        <Button
                            onClick={() =>
                                handleExpenseDelete(
                                    selectedExpense._id,
                                    group_id
                                )
                            }
                            autoFocus
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
                <Modal
                    show={showModification}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    centered
                >
                    <Form onSubmit={handleExpenseUpdate}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    <h3>Expense detail</h3>
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="light"
                                    onClick={handleAlertOpen}
                                    className="mb-3"
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="warning"
                                    type="submit"
                                    className="mb-3"
                                    disabled={amount === 0}
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
                    <DialogTitle id="alert-dialog-title">
                        {"Delete Expense"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you wish to delete this transaction?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAlertClose}>Keep</Button>
                        <Button
                            onClick={() =>
                                handleExpenseDelete(
                                    selectedExpense._id,
                                    group_id
                                )
                            }
                            autoFocus
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
