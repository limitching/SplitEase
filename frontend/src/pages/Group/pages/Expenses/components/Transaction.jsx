import { useContext } from "react";
import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../../../../../utils/api";
import { SPLIT_METHODS } from "../../../../../global/constant";

import { GroupContext } from "../../../../../contexts/GroupContext";
import {
    ExpenseContext,
    localISOTime,
} from "../../../../../contexts/ExpenseContext";
import { TransactionSelector, ModalContent } from "./Modal";

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
`;

const Transaction = () => {
    const { members, gid, memberMap, setExpensesChanged } =
        useContext(GroupContext);
    const {
        checked,
        subValues,
        subCredit,
        selectedSplitMethod,
        amount,
        selectedCreditor,
        showTransaction,
        setChecked,
        setSubCredit,
        setSelectedSplitMethod,
        setSelectedCurrency,
        setAmount,
        setSelectedCreditor,
        setExpenseTime,
        setShowTransaction,
    } = useContext(ExpenseContext);

    const handleClose = () => setShowTransaction(false);
    // When Transaction window is opened, set amount = 0
    const handleShow = () => {
        setAmount(0);
        setChecked([...members]);
        setShowTransaction(true);
        // TODO: Set default creditor when user is done
        setSelectedCreditor(1);
        setSelectedCurrency(1);
        setSelectedSplitMethod(0);
        setExpenseTime(localISOTime);
        setSubCredit(Array(members.length).fill(0));
    };

    const handleExpenseSubmit = async (event) => {
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

        formData.append("split_method", SPLIT_METHODS[selectedSplitMethod]);
        formData.append("attached_group_id", gid);
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
        // TODO: debug;
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }

        const response = await api.createExpense(formData);
        if (response.status === 200) {
            setExpensesChanged(true);
            // handleClickVariant("Expense Created successfully!", "success");
            MySwal.fire({
                title: <p>Expense Created successfully!</p>,
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
                title: <p>Client Side Error</p>,
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

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Transaction
            </Button>
            {selectedCreditor !== "multi" ? (
                <Modal
                    show={showTransaction}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Form onSubmit={handleExpenseSubmit}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    <TransactionSelector />
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="warning"
                                    type="submit"
                                    disabled={amount === 0}
                                >
                                    Save
                                </Button>
                            </Container>
                        </Modal.Footer>
                    </Form>
                </Modal>
            ) : (
                <Modal
                    show={showTransaction}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                >
                    <Form onSubmit={handleExpenseSubmit}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    <TransactionSelector />
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="warning"
                                    type="submit"
                                    disabled={amount === 0}
                                >
                                    Save
                                </Button>
                            </Container>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
        </>
    );
};
export default Transaction;
