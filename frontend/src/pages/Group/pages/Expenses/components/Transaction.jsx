import { useContext, useState } from "react";
import { Container, Modal, Form, Col, Row } from "react-bootstrap";
import { Button } from "@mui/material";
import styled from "styled-components";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../../../../../utils/api";
import {
    SPLIT_METHODS,
    DASHBOARD_BG_COLOR,
    HEADER_BG_COLOR,
} from "../../../../../global/constant";
// import { Button } from "react-bootstrap";
// import Button from "@mui/material-next/Button";
import AddIcon from "@mui/icons-material/Add";
import { GroupContext } from "../../../../../contexts/GroupContext";
import {
    ExpenseContext,
    localISOTime,
} from "../../../../../contexts/ExpenseContext";
import { AuthContext } from "../../../../../contexts/AuthContext";
import { ModalContent } from "./Modal";
import { FixedButtonWrapper } from "../../../components/PageWrapper";

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
`;

const ModalHeader = styled.h5`
    margin-bottom: 0px;
`;

const Transaction = () => {
    const { members, group_id, setExpensesChanged } = useContext(GroupContext);
    const {
        checked,
        subValues,
        subCredit,
        selectedSplitMethod,
        amount,
        selectedCreditor,
        showTransaction,
        expenseTime,
        setChecked,
        setSubCredit,
        setSelectedSplitMethod,
        setSelectedCurrency,
        setAmount,
        setSelectedCreditor,
        setExpenseTime,
        setShowTransaction,
        setDescription,
    } = useContext(ExpenseContext);
    const { user, jwtToken } = useContext(AuthContext);
    const { setSelectedExpense } = useContext(ExpenseContext);
    const { group } = useContext(GroupContext);
    const [hasError, setHasError] = useState(false);

    const handleClose = () => setShowTransaction(false);
    // When Transaction window is opened, set amount = 0
    const handleShow = () => {
        setAmount(0);
        setSelectedExpense(null);
        setChecked([...members]);
        // TODO: Set default creditor when user is done
        setSelectedCreditor(user.id);
        setSelectedCurrency(group.default_currency);
        setSelectedSplitMethod(0);
        setDescription("");
        setExpenseTime(localISOTime);
        setSubCredit(Array(members.length).fill(0));
        setShowTransaction(true);
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
        formData.append("attached_group_id", group_id);
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
        formData.append("date", expenseTime);
        // TODO: debug;
        // for (const pair of formData.entries()) {
        //     console.log(`${pair[0]}, ${pair[1]}`);
        // }

        const response = await api.createExpense(formData, jwtToken);
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
            <FixedButtonWrapper>
                <Button
                    onClickCapture={handleShow}
                    disabled={false}
                    size="large"
                    variant="filled"
                    startIcon={<AddIcon></AddIcon>}
                    sx={{
                        bgcolor: DASHBOARD_BG_COLOR,
                        "&:hover": {
                            bgcolor: DASHBOARD_BG_COLOR,
                            opacity: 0.87,
                        },
                        borderRadius: "100px",
                        color: "white",
                        padding: "12px 26px",
                    }}
                >
                    ADD EXPENSE
                </Button>
            </FixedButtonWrapper>

            {selectedCreditor !== "multi" ? (
                <Modal
                    show={showTransaction}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    <Form onSubmit={handleExpenseSubmit}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    {/* <TransactionSelector /> */}
                                    <ModalHeader>New Expense</ModalHeader>
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent
                                hasError={hasError}
                                setHasError={setHasError}
                            />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={amount === 0 || hasError}
                                    disableElevation
                                    sx={{
                                        backgroundColor: HEADER_BG_COLOR,
                                        "&:hover": {
                                            backgroundColor: "#cdae21",
                                        },
                                    }}
                                >
                                    {hasError ? "Invalid Input" : "Save"}
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
                    centered
                >
                    <Form onSubmit={handleExpenseSubmit}>
                        <Modal.Header closeButton as={Row}>
                            <Container className="transaction-method ml-0 pl-0">
                                <Col lg="6">
                                    {/* <TransactionSelector /> */}
                                    <ModalHeader>New Expense</ModalHeader>
                                </Col>
                            </Container>
                        </Modal.Header>
                        <StyledModalBody>
                            <ModalContent
                                hasError={hasError}
                                setHasError={setHasError}
                            />
                        </StyledModalBody>
                        <Modal.Footer>
                            <Container className="d-grid">
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={amount === 0 || hasError}
                                    disableElevation
                                    sx={{
                                        backgroundColor: HEADER_BG_COLOR,
                                        "&:hover": {
                                            backgroundColor: "#cdae21",
                                        },
                                    }}
                                >
                                    {hasError ? "Invalid Input" : "Save"}
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
