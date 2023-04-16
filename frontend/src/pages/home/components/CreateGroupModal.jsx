import { Container, Modal, Button, Form, Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { TextField } from "@mui/material";
import CurrencySelector from "../../Group/pages/Expenses/components/CurrencySelector";

const StyledExpenseImage = styled.img`
    width: 400px;
    hight: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    overflow: scroll;
`;
const StyledModalBody = styled(Modal.Body)`
    max-height: 800px;
    overflow: scroll;
`;

// const GroupDescription = () => {
//     const { selectedExpense } = useContext(ExpenseContext);
//     return (
//         <Container className="expense-description mb-3">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//                 as="textarea"
//                 name="description"
//                 rows={3}
//                 defaultValue={
//                     selectedExpense ? selectedExpense.description : ""
//                 }
//             />
//         </Container>
//     );
// };

// const GroupImage = () => {
//     const { selectedExpense } = useContext(ExpenseContext);
//     return (
//         <Container className="expense-image mb-3">
//             <Form.Label>Receipt photo</Form.Label>
//             {selectedExpense && selectedExpense.image ? (
//                 <Container>
//                     <StyledExpenseImage
//                         src={`http://localhost:3000/assets/${selectedExpense.image}`}
//                         alt="Ops, your network is unstable, so this image cannot load."
//                     ></StyledExpenseImage>
//                 </Container>
//             ) : null}
//             <Form.Control type="file" name="image" />
//         </Container>
//     );
// };
// const ModalContent = () => {
//     return <div></div>;
// };

const CreateGroupModal = ({
    showCreateGroupModal,
    handleCloseCreateGroupModal,
}) => {
    return (
        <Modal
            show={showCreateGroupModal}
            onHide={handleCloseCreateGroupModal}
            backdrop="static"
            keyboard={false}
            size="md"
            centered
        >
            <Form>
                <Modal.Header closeButton as={Row}>
                    <Container className="modal-header-text ml-0 pl-0">
                        <h3>Create a new group</h3>
                    </Container>
                </Modal.Header>
                <StyledModalBody>
                    <TextField
                        name="name"
                        className="mb-3"
                        label="Group name"
                        type="text"
                    />
                    <CurrencySelector></CurrencySelector>
                </StyledModalBody>
                <Modal.Footer>
                    <Container className="d-grid">
                        <Button variant="warning">Create a new group</Button>
                    </Container>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default CreateGroupModal;
