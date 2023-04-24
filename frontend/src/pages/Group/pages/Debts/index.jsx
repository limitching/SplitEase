import DebtsBlock from "./components/DebtsBlock";
import { useContext, useState } from "react";
import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
    FixedButtonWrapper,
} from "../../components/PageWrapper";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material-next/Button";
import { DASHBOARD_BG_COLOR } from "../../../../global/constant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { api } from "../../../../utils/api";
import { GroupContext } from "../../../../contexts/GroupContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const Debts = () => {
    const [alertOpen, setAlertOpen] = useState(false);
    const { group_id, group, setExpensesChanged, debts } =
        useContext(GroupContext);
    const { jwtToken, user } = useContext(AuthContext);
    const [selectSettlingDate, setSelectSettlingDate] = useState(
        dayjs(new Date())
    );
    const handleAlertOpen = () => {
        setSelectSettlingDate(dayjs(new Date()).startOf("day"));
        setAlertOpen(true);
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleStartSettling = async (selectSettlingDate) => {
        console.log(selectSettlingDate);
        const formattedDate = selectSettlingDate.toISOString();
        console.log(formattedDate);
        const startSettlingData = { deadline: formattedDate };
        const response = await api.startSettlingGroupDebts(
            group_id,
            startSettlingData,
            jwtToken
        );
        console.log(response);
        if (response.status === 200) {
            handleAlertClose();
            MySwal.fire({
                title: <p>Start Settling Successfully!</p>,
                icon: "success",
                timer: 1000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        } else {
            handleAlertClose();
            const { error } = response.data;
            MySwal.fire({
                title: <p>Unauthorized</p>,
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

    let isNoDebts = true;

    for (let currency_option in debts) {
        if (debts[currency_option].length !== 0) {
            isNoDebts = false;
            break;
        }
    }

    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>{isNoDebts ? "No Debts :)" : "Total debts"}</h6>
                </HeaderTextContainer>
                <ListWrapper>
                    <DebtsBlock></DebtsBlock>
                </ListWrapper>
                <FixedButtonWrapper>
                    <Button
                        color="primary"
                        size="large"
                        variant="filled"
                        startIcon={<AccessTimeIcon></AccessTimeIcon>}
                        onClickCapture={handleAlertOpen}
                        sx={{
                            bgcolor: DASHBOARD_BG_COLOR,
                            "&:hover": {
                                bgcolor: DASHBOARD_BG_COLOR,
                                opacity: 0.87,
                            },
                        }}
                        disabled={user.id === group.owner ? false : true}
                    >
                        START SETTLING
                    </Button>
                </FixedButtonWrapper>
            </PageWrapper>
            <Dialog
                open={alertOpen}
                onClose={handleAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Start Settling"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <strong>
                            Make sure that you want to start settling
                        </strong>
                        <br />
                        Select a date to update all expenses with a date prior
                        to the selected date from 'unsettled' to 'settling'
                        status.
                        <br />
                    </DialogContentText>
                    <br></br>
                    <DatePicker
                        label="Select date"
                        value={selectSettlingDate}
                        onChange={(newValue) => setSelectSettlingDate(newValue)}
                        slotProps={{
                            textField: {
                                helperText: "Format: MM/DD/YYYY",
                            },
                        }}
                        disableFuture
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleAlertClose}>Cancel</MuiButton>
                    <MuiButton
                        onClick={() => handleStartSettling(selectSettlingDate)}
                        autoFocus
                        disabled={user.id === group.owner ? false : true}
                    >
                        Confirm
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Debts;
