import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "../../../../../utils/api";
import { SPLIT_METHODS } from "../../../../../global/constant";
import CreditorsBlock from "./CreditorsBlock";
import DebtorsBlock from "./DebtorsBlock";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { useContext } from "react";

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    height: 700px;
    overflow: scroll;
`;

const TransactionSelector = () => {
    return (
        <Form.Select aria-label="Default select example">
            <option value="1">New Expense</option>
            <option value="2">New Income</option>
            <option value="3">New Settle up</option>
        </Form.Select>
    );
};

const Transaction = ({
    showTransaction,
    setShowTransaction,
    currencies,
    selectedCreditor,
    setSelectedCreditor,
    checked,
    setChecked,
    localISOTime,
    expenseTime,
    setExpenseTime,
    amount,
    setAmount,
    selectedCurrency,
    setSelectedCurrency,
    selectedSplitMethod,
    setSelectedSplitMethod,
    subValues,
    setSubValues,
}) => {
    const { members, gid, memberMap, setExpensesChanged } =
        useContext(GroupContext);
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
    };
    // Select NT$ on default

    // When credit amount change, update state

    const handleExpenseSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const creditor = memberMap.get(Number(selectedCreditor));
        const creditorsAmounts = new Map();
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
        creditorsAmounts.set(creditor.id, Number(amount));

        formData.append("split_method", SPLIT_METHODS[selectedSplitMethod]);
        formData.append("attached_group_id", gid);
        formData.append("creditors", JSON.stringify(creditor));
        formData.append("debtors", JSON.stringify(checked));
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
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }

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

    const handleExpenseTimeChange = (event) => {
        setExpenseTime(event.target.value);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Transaction
            </Button>

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
                        <CreditorsBlock
                            currencies={currencies}
                            selectedCurrency={selectedCurrency}
                            setSelectedCurrency={setSelectedCurrency}
                            selectedCreditor={selectedCreditor}
                            setSelectedCreditor={setSelectedCreditor}
                            amount={amount}
                            setAmount={setAmount}
                            subValues={subValues}
                            setSubValues={setSubValues}
                            selectedSplitMethod={selectedSplitMethod}
                        />

                        <hr />

                        <DebtorsBlock
                            currencies={currencies}
                            selectedCurrency={selectedCurrency}
                            amount={amount}
                            setAmount={setAmount}
                            setSelectedSplitMethod={setSelectedSplitMethod}
                            checked={checked}
                            setChecked={setChecked}
                            selectedSplitMethod={selectedSplitMethod}
                            subValues={subValues}
                            setSubValues={setSubValues}
                        ></DebtorsBlock>

                        <Container className="expense-description mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                            />
                        </Container>
                        <Container className="expense-image mb-3">
                            <Form.Label>Expense image</Form.Label>
                            <Form.Control type="file" name="image" />
                        </Container>
                        <Container className="expense-datetime mb-3">
                            <Form.Label>Date & time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                defaultValue={expenseTime}
                                onChange={handleExpenseTimeChange}
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
        </>
    );
};
export default Transaction;
