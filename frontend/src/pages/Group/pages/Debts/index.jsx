import DebtsBlock from "./components/DebtsBlock";
import { useContext, useState } from "react";
import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
    FixedButtonWrapper,
} from "../../components/PageWrapper";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
} from "@mui/material";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
    const { group_id, group, setExpensesChanged, debts, showFixedButton } =
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
                    <h5>{isNoDebts ? "No Debts :)" : "Total debts"}</h5>
                </HeaderTextContainer>
                <ListWrapper>
                    <DebtsBlock></DebtsBlock>
                </ListWrapper>
                <FixedButtonWrapper
                    style={{
                        transition:
                            "transform 0.5s ease-out, opacity 0.5s ease-out",
                        transform: showFixedButton
                            ? "translateY(0)"
                            : "translateY(120%)",
                        opacity: showFixedButton ? 1 : 0,
                    }}
                >
                    <Tooltip
                        title={"Only group owner can start settling"}
                        placement="top"
                    >
                        <div>
                            <Button
                                color="primary"
                                size="large"
                                variant="filled"
                                startIcon={<AccessTimeIcon></AccessTimeIcon>}
                                onClickCapture={handleAlertOpen}
                                sx={{
                                    bgcolor:
                                        user.id === group.owner
                                            ? DASHBOARD_BG_COLOR
                                            : "transparent",
                                    "&:hover": {
                                        bgcolor:
                                            user.id === group.owner
                                                ? DASHBOARD_BG_COLOR
                                                : "transparent",
                                        opacity: 0.87,
                                    },
                                    border: "1px solid black",
                                    borderRadius: "100px",
                                    color: "white",
                                    padding: "12px 26px",
                                    display: isNoDebts ? "none" : "flex",
                                }}
                                disabled={user.id !== group.owner}
                            >
                                START SETTLING
                            </Button>
                        </div>
                    </Tooltip>
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
                    <Button onClick={handleAlertClose}>Cancel</Button>
                    <Button
                        onClick={() => handleStartSettling(selectSettlingDate)}
                        autoFocus
                        disabled={user.id === group.owner ? false : true}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Debts;
