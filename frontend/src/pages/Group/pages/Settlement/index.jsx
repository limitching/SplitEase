import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";
import SettlingDebtsBlock from "./components/SettlingDebtsBlock";
import { useState, useContext } from "react";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemText,
    ListItem,
    Avatar,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../../../contexts/AuthContext";
import { GroupContext } from "../../../../contexts/GroupContext";
import { CURRENCY_MAP } from "../../../../global/constant";
import { api } from "../../../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const Settlement = () => {
    const [selectDebt, setSelectDebt] = useState({
        payer_id: null,
        payee_id: null,
        amount: null,
        currency_option: null,
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const { jwtToken } = useContext(AuthContext);
    const { group_id, setExpensesChanged, memberMap } =
        useContext(GroupContext);
    const handleAlertOpen = () => {
        setAlertOpen(true);
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleMarkAsSettled = async () => {
        handleAlertClose();
        const response = await api.settleUpGroupDebts(
            group_id,
            selectDebt,
            jwtToken
        );
        console.log(response);
        if (response.status === 200) {
            MySwal.fire({
                title: <p>SettleUp Successfully!</p>,
                icon: "success",
                timer: 1000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        } else {
            const { error } = response.data;
            MySwal.fire({
                title: <p>Server Side Error</p>,
                html: <p>{error}</p>,
                icon: "error",
                timer: 2000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        }

        setExpensesChanged(true);
    };
    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Settling debts (Debts in settling process...)</h6>
                    <MuiButton>Hi</MuiButton>
                </HeaderTextContainer>
                <ListWrapper>
                    <SettlingDebtsBlock
                        setSelectDebt={setSelectDebt}
                        handleMarkAsSettled={handleMarkAsSettled}
                        handleAlertOpen={handleAlertOpen}
                    ></SettlingDebtsBlock>
                </ListWrapper>
            </PageWrapper>
            <Dialog
                open={alertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"SettleUp Debt"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <strong>
                            Transfer between{" "}
                            {memberMap.get(Number(selectDebt.payer_id))?.name ??
                                "Unknown"}
                            and{" "}
                            {memberMap.get(Number(selectDebt.payee_id))?.name ??
                                "Unknown"}
                        </strong>
                        <br />
                        Make sure you marked debt as settled after you receive
                        the bill.
                        <br />
                        When you click confirm, this debt will mark as settled.
                    </DialogContentText>
                    <ListItem>
                        <Avatar
                            alt={
                                memberMap.get(Number(selectDebt.payer_id))
                                    ?.name ?? "Unknown"
                            }
                            src={
                                memberMap.get(Number(selectDebt.payer_id))
                                    ?.image ?? "Unknown"
                            }
                        />
                        <Container>
                            <ListItemText
                                primary={`${
                                    memberMap.get(Number(selectDebt.payer_id))
                                        ?.name ?? "Unknown"
                                }`}
                                secondary={`Payer`}
                            ></ListItemText>
                        </Container>

                        <Container>
                            <ListItemText
                                primary={`→`}
                                secondary={`${selectDebt.amount} ${
                                    CURRENCY_MAP[selectDebt.currency_option]
                                        ?.symbol ?? "Unknown"
                                }`}
                                sx={{
                                    textAlign: "center",
                                }}
                            ></ListItemText>
                        </Container>

                        <Container>
                            <ListItemText
                                primary={`${
                                    memberMap.get(Number(selectDebt.payee_id))
                                        ?.name ?? "Unknown"
                                }`}
                                secondary={`Receiver`}
                                sx={{ textAlign: "right" }}
                            ></ListItemText>
                        </Container>
                        <Avatar
                            alt={
                                memberMap.get(Number(selectDebt.payee_id))
                                    ?.name ?? "Unknown"
                            }
                            src={
                                memberMap.get(Number(selectDebt.payee_id))
                                    ?.image ?? "Unknown"
                            }
                        />
                    </ListItem>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleAlertClose}>Cancel</MuiButton>
                    <MuiButton onClick={() => handleMarkAsSettled()} autoFocus>
                        Confirm
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Settlement;
