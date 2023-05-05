import React, { useState } from "react";
import Joyride from "react-joyride";
import Button from "@mui/material/Button";
import TourIcon from "@mui/icons-material/Tour";

export default function GroupGuide() {
    const [{ run, steps }, setState] = useState({
        run: false,
        steps: [
            {
                title: "Dashboard",
                target: "#dashboard",
                content:
                    "This area shows group members with a negative Balance, where the system will suggest that the next payment can be paid by the largest debtor.",
                placement: "bottom",
            },
            {
                title: "Expense Tab",
                target: "#expenses-tab",
                content: "A tab to create, edit & delete expenses.",
                placement: "bottom",
            },
            {
                title: "Debts Tab",
                target: "#debts-tab",
                content: "A tab to review the debts among group members.",
                placement: "bottom",
            },
            {
                title: "Settlement Tab",
                target: "#settlement-tab",
                content:
                    "A tab to summarize current settling activities.\nGroup owner can start settling activity in this tab.",
                placement: "bottom",
            },
            {
                title: "Member Tab",
                target: "#members-tab",
                content: "A tab shows group members and balances.",
                placement: "bottom",
            },
            {
                title: "Activities Tab",
                target: "#activities-tab",
                content:
                    "A tab which recorded all the logs related to the group.",
                placement: "bottom",
            },
            {
                title: "Invitation Tab",
                target: "#join-tab",
                content:
                    "A tab with invitation link and QRcode to invite friends to join.",
                placement: "bottom",
            },
            {
                title: "Edit group",
                target: "#more-button",
                content: "Here you can edit group information.",
                placement: "bottom",
            },
        ],
    });

    const handleClickStart = (event) => {
        event.preventDefault();
        console.log(steps);
        setState({
            run: true,
            steps,
        });
    };

    return (
        <>
            <div className="app">
                <Joyride
                    steps={steps}
                    continuous
                    hideCloseButton
                    scrollToFirstStep
                    showProgress
                    showSkipButton
                    disableScrolling
                    // run={run}
                />
            </div>
        </>
    );
}
