import CreditorsBlock from "./CreditorsBlock";
import DebtorsBlock from "./DebtorsBlock";
import styled from "styled-components";
import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api, HOST } from "../../../../../utils/api";
import { SPLIT_METHODS } from "../../../../../global/constant";

const MySwal = withReactContent(Swal);

const StyledModalBody = styled(Modal.Body)`
    height: 700px;
    overflow: scroll;
`;

const StyledExpenseImage = styled.img`
    width: 400px;
    hight: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    overflow: scroll;
`;

const ExpenseModificationModal = ({
    gid,
    showModification,
    setShowModification,
    members,
    memberMap,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    selectedSplitMethod,
    setSelectedSplitMethod,
    checked,
    setChecked,
    expenseTime,
    setExpenseTime,
    setExpensesChanged,
    selectedExpense,
    amount,
    setAmount,
    selectedCreditor,
    setSelectedCreditor,
    description,
    setDescription,
}) => {
    const handleClose = () => setShowModification(false);

    const handleExpenseUpdate = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        // TODO:
        formData.append("eid", selectedExpense._id);
        formData.append("split_method", SPLIT_METHODS[selectedSplitMethod]);
        formData.append("attached_group_id", gid);
        formData.append(
            "creditors",
            JSON.stringify(memberMap.get(Number(selectedCreditor)))
        );
        formData.append("debtors", JSON.stringify(checked));

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

    const handleExpenseTimeChange = (event) => {
        setExpenseTime(event.target.value);
    };

    const handleExpenseDelete = async (eid, gid) => {
        const response = await api.deleteExpense(eid, gid);
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

    return (
        <>
            <Modal
                show={showModification}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
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
                        <CreditorsBlock
                            members={members}
                            currencies={currencies}
                            selectedCurrency={selectedCurrency}
                            setSelectedCurrency={setSelectedCurrency}
                            selectedCreditor={selectedCreditor}
                            setSelectedCreditor={setSelectedCreditor}
                            amount={amount}
                            setAmount={setAmount}
                        />

                        <hr />

                        <DebtorsBlock
                            members={members}
                            currencies={currencies}
                            selectedCurrency={selectedCurrency}
                            amount={amount}
                            setSelectedSplitMethod={setSelectedSplitMethod}
                            checked={checked}
                            setChecked={setChecked}
                            selectedSplitMethod={selectedSplitMethod}
                        ></DebtorsBlock>

                        <Container className="expense-description mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                defaultValue={description}
                                rows={3}
                            />
                        </Container>
                        <Container className="expense-image mb-3">
                            <Form.Label>Expense image</Form.Label>
                            {selectedExpense ===
                            null ? null : selectedExpense.image ===
                              null ? null : (
                                <Container>
                                    <StyledExpenseImage
                                        src={
                                            HOST +
                                            "/assets/" +
                                            selectedExpense.image
                                        }
                                        alt={selectedExpense.title}
                                    />
                                </Container>
                            )}

                            <Form.Control type="file" name="image" />
                        </Container>
                        <Container className="expense-datetime mb-3">
                            <Form.Label>Date & time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="date"
                                defaultValue={expenseTime.substring(0, 16)}
                                onChange={handleExpenseTimeChange}
                            />
                        </Container>
                    </StyledModalBody>
                    <Modal.Footer>
                        <Container className="d-grid">
                            <Button
                                variant="light"
                                onClick={() =>
                                    handleExpenseDelete(
                                        selectedExpense._id,
                                        gid
                                    )
                                }
                                className="mb-3"
                            >
                                Delete
                            </Button>
                            <Button
                                variant="warning"
                                type="submit"
                                className="mb-3"
                            >
                                Update
                            </Button>
                        </Container>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default ExpenseModificationModal;
