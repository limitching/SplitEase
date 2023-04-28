import {
    CURRENCY_OPTIONS,
    ANIMAL_AVATAR,
} from "../../../../../global/constant";
import { useContext, useState } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import { AuthContext } from "../../../../../contexts/AuthContext";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import VerifiedIcon from "@mui/icons-material/Verified";

import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Tooltip,
} from "@mui/material";
import { Container } from "react-bootstrap";
import { api } from "../../../../../utils/api";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const SettlingDebtsBlock = ({ handleAlertOpen, setSelectDebt }) => {
    const { members, settlingDebts, indexMap, group_id } =
        useContext(GroupContext);
    const { jwtToken } = useContext(AuthContext);
    const [notifyData, setNotifyData] = useState({
        debtor_id: 0,
        creditor_id: 0,
        amount: 0,
        currency_option: 1,
    });

    const handleNotify = async (event) => {
        event.preventDefault();
        const response = await api.notifyDebtor(jwtToken, notifyData, group_id);
        console.log(response);
        if (response.error) {
            return MySwal.fire({
                title: <p>Error</p>,
                html: <p>{response.error}</p>,
                icon: "error",
                timer: 1000,
                didOpen: () => {
                    MySwal.showLoading();
                },
            });
        }

        MySwal.fire({
            title: <p>Successfully Notify!</p>,
            icon: "success",
            timer: 1000,
            didOpen: () => {
                MySwal.showLoading();
            },
        });
    };

    return (
        <>
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    bgcolor: "background.paper",
                }}
            >
                {Object.entries(settlingDebts).map(
                    ([currencyOption, transactions], index) => {
                        const [currency] = CURRENCY_OPTIONS.filter(
                            (currency) => currency.id === Number(currencyOption)
                        );
                        return transactions.map((transaction, index) => {
                            const debtor = members[transaction[0]];
                            const creditor = members[transaction[1]];
                            const debtAmounts = transaction[2];

                            return (
                                <div key={"settlingDebtsList" + index}>
                                    <Divider></Divider>
                                    <ListItem>
                                        <ListItemButton
                                            onMouseEnter={() => {
                                                setNotifyData({
                                                    debtor_id: debtor.id,
                                                    creditor_id: creditor.id,
                                                    amount: debtAmounts,
                                                    currency_option:
                                                        currency.id,
                                                });
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Tooltip title={debtor.name}>
                                                    <Avatar
                                                        alt={`${debtor.name}`}
                                                        src={
                                                            debtor.image
                                                                ? debtor.image
                                                                : ANIMAL_AVATAR[
                                                                      indexMap.get(
                                                                          debtor.id
                                                                      )
                                                                  ]
                                                        }
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                        }}
                                                    />
                                                </Tooltip>
                                            </ListItemAvatar>
                                            <Container>
                                                <ListItemText
                                                    primary={debtor.name}
                                                    secondary={`${
                                                        currency.symbol
                                                    } ${Number(
                                                        debtAmounts.toFixed(2)
                                                    )}`}
                                                />
                                            </Container>
                                            <Container
                                                style={{ maxWidth: "30px" }}
                                            >
                                                <ListItemText
                                                    primary="→"
                                                    sx={{
                                                        textAlign: "center",
                                                    }}
                                                />
                                            </Container>
                                            <Container>
                                                <ListItemText
                                                    primary={creditor.name}
                                                    sx={{ textAlign: "right" }}
                                                />
                                            </Container>

                                            <ListItemAvatar>
                                                <Tooltip title={creditor.name}>
                                                    <Avatar
                                                        alt={creditor.name}
                                                        src={
                                                            creditor.image
                                                                ? creditor.image
                                                                : ANIMAL_AVATAR[
                                                                      indexMap.get(
                                                                          creditor.id
                                                                      )
                                                                  ]
                                                        }
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                        }}
                                                    />
                                                </Tooltip>
                                            </ListItemAvatar>

                                            <Container
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    display: "flex",
                                                }}
                                            >
                                                <Tooltip
                                                    title={`Marked as settled`}
                                                >
                                                    <IconButton
                                                        onClick={(event) => {
                                                            setSelectDebt({
                                                                payer_id:
                                                                    debtor.id,
                                                                payee_id:
                                                                    creditor.id,
                                                                amount: debtAmounts,
                                                                currency_option:
                                                                    currency.id,
                                                            });

                                                            handleAlertOpen(
                                                                event
                                                            );
                                                        }}
                                                    >
                                                        <VerifiedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title={`Remind ${debtor.name}`}
                                                >
                                                    <IconButton
                                                        onClick={(event) => {
                                                            handleNotify(event);
                                                        }}
                                                    >
                                                        <NotificationsActiveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Container>
                                        </ListItemButton>
                                    </ListItem>
                                </div>
                            );
                        });
                    }
                )}
            </List>
        </>
    );
};

export default SettlingDebtsBlock;
