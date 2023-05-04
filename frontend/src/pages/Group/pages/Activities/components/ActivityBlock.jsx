import { useContext } from "react";
import { GroupContext } from "../../../../../contexts/GroupContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Container } from "react-bootstrap";
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Tooltip,
} from "@mui/material";
import styled from "styled-components";
import { ANIMAL_AVATAR } from "../../../../../global/constant";
import { HeaderTextContainer } from "../../../components/PageWrapper";

const ActivitiesContainer = styled(Container)`
    padding: 0px 16px;
`;

const LogContainer = styled(Container)`
    padding: 8px 0px;
`;

dayjs.extend(utc);
dayjs.extend(timezone);

const ActivityBlock = () => {
    const { logs, memberMap, indexMap } = useContext(GroupContext);

    return (
        <>
            <HeaderTextContainer>
                <h6>{"Activities"}</h6>
            </HeaderTextContainer>
            <ActivitiesContainer>
                <List
                    dense
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        bgcolor: "background.paper",
                    }}
                >
                    <Divider></Divider>
                    {logs.map((log, index) => {
                        const user = memberMap.get(log.user_id);
                        const formattedDate = dayjs
                            .utc(log.log_time)
                            .tz("Asia/Taipei")
                            .format("MM/DD/YYYY, h:mm:ss A");

                        const eventTargetText = (event, event_target) => {
                            if (
                                event ===
                                "update all expenses with a date prior to"
                            ) {
                                return dayjs
                                    .utc(log.event.target)
                                    .tz("Asia/Taipei")
                                    .format("MM/DD/YYYY");
                            }
                            if (
                                event === "create expense" ||
                                event === "update expense" ||
                                event === "delete expense"
                            ) {
                                if (event_target) {
                                    return event_target;
                                } else {
                                    return "Expense";
                                }
                            }
                            if (event === "marked debt as settled") {
                                const match =
                                    event_target.match(/(\d+) to (\d+)/);
                                const payer_id = parseInt(match?.[1] ?? 0);
                                const payee_id = parseInt(match?.[2] ?? 0);
                                let payer = memberMap.get(payer_id) ?? {
                                    name: "",
                                };
                                let payee = memberMap.get(payee_id) ?? {
                                    name: "",
                                };
                                return `${payer.name}→${payee.name}` ?? "";
                            }
                            if (
                                event === "create group" ||
                                event === "join group via code" ||
                                event === "archive group"
                            ) {
                                return "";
                            }

                            if (event === "modify group") {
                                if (event_target) {
                                    return event_target;
                                } else {
                                    return "Expense";
                                }
                            }
                        };

                        const eventValueText = (event, event_value) => {
                            if (event_value === null) {
                                return "";
                            }
                            if (
                                event === "create group" ||
                                event === "join group via code" ||
                                event === "archive group"
                            ) {
                                return "";
                            } else {
                                return `(${event_value})`;
                            }
                        };

                        return (
                            <div key={`activity-list ${index}`}>
                                <LogContainer>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <ListItemAvatar>
                                                <Tooltip title={user.name}>
                                                    <Avatar
                                                        alt={user.name}
                                                        src={
                                                            user.image
                                                                ? user.image
                                                                : ANIMAL_AVATAR[
                                                                      indexMap.get(
                                                                          user.id
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
                                        </ListItemAvatar>
                                        <Container>
                                            <ListItemText
                                                primary={`${user.name} ${
                                                    log.event
                                                } ${eventTargetText(
                                                    log.event,
                                                    log.event_target
                                                )} ${eventValueText(
                                                    log.event,
                                                    log.event_value
                                                )}`}
                                                secondary={formattedDate}
                                            />
                                        </Container>
                                    </ListItem>
                                </LogContainer>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </ActivitiesContainer>
        </>
    );
};

export { ActivityBlock };
