import { SPLIT_METHODS } from "../../../../../global/constant";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    AvatarGroup,
} from "@mui/material";
const DebtsBlock = ({ members, debts }) => {
    return (
        <div
            className="group-information"
            style={{
                width: "50%",
                backgroundColor: "lightgreen",
                fontSize: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <List
                dense
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                }}
            >
                {debts.map((debt, index) => {
                    const labelId = `checkbox-list-secondary-label-${index}`;
                    const creditor = members[debt[0]];
                    const debtor = members[debt[1]];
                    const debtAmounts = debt[2];

                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemAvatar
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        alt={`${creditor.name}`}
                                        src={`/static/images/avatar/${
                                            index + 1
                                        }.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    id={labelId}
                                    primary={creditor.name}
                                    secondary={debtAmounts}
                                    sx={{
                                        textAlign: "LEFT",
                                        maxWidth: "130px",
                                    }}
                                />
                                <ListItemText
                                    id={labelId}
                                    primary="→"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        maxWidth: "50px",
                                    }}
                                />
                                <ListItemText
                                    id={labelId}
                                    primary={debtor.name}
                                    sx={{
                                        textAlign: "right",
                                        maxWidth: "130px",
                                    }}
                                />
                                <ListItemAvatar
                                    sx={{
                                        display: "flex",
                                        justifyContent: "right",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        alt={`${debtor.name}`}
                                        src={`/static/images/avatar/${
                                            index + 1
                                        }.jpg`}
                                    />
                                </ListItemAvatar>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

export default DebtsBlock;
