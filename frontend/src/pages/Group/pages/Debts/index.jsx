import DebtsBlock from "./components/DebtsBlock";
import { useState } from "react";
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

const Debts = () => {
    const [alertOpen, setAlertOpen] = useState(false);
    const handleAlertOpen = () => {
        setAlertOpen(true);
    };
    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleStartSettling = () => {};
    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Total debts</h6>
                </HeaderTextContainer>
                <ListWrapper>
                    <DebtsBlock></DebtsBlock>
                </ListWrapper>
                <FixedButtonWrapper>
                    <Button
                        color="primary"
                        disabled={false}
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
                        defaultValue={dayjs(new Date())}
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
                    <MuiButton onClick={() => handleStartSettling()} autoFocus>
                        Confirm
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Debts;
