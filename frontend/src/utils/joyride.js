import Joyride, { ACTIONS, EVENTS, LIFECYCLE, STATUS } from "react-joyride";

const STEP = [
    {
        title: "Dashboard",
        target: "#dashboard",
        content:
            "This area shows group members with a negative Balance, where the system will suggest that the next payment can be paid by the largest debtor.",
        placement: "bottom",
        disableBeacon: true,
    },
    {
        title: "Expenses Tab",
        target: "#expenses-tab",
        content: "A tab to create, edit & delete expenses.",
        placement: "bottom",
    },
    {
        title: "Debts Tab",
        target: "#debts-tab",
        content:
            "A tab to review the debts among group members. Group owner can start settling activity in this tab.",
        placement: "bottom",
    },
    {
        title: "Settlement Tab",
        target: "#settlement-tab",
        content: "A tab to summarize current settling activities.",
        placement: "bottom",
    },
    {
        title: "Members Tab",
        target: "#members-tab",
        content: "A tab shows group members and balances.",
        placement: "bottom",
    },
    {
        title: "Activities Tab",
        target: "#activities-tab",
        content: "A tab which recorded all the logs related to the group.",
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
    {
        title: "All done!",
        target: "#guide",
        content:
            "If you have any operational questions, please feel free to click this button.",
        placement: "top",
    },
];

const handleJoyrideCallback = (data, joyrideState, setJoyrideState) => {
    const { action, index, type, status } = data;
    // console.log(
    //     "TYPE:",
    //     type,
    //     "INDEX:",
    //     index,
    //     "STATUS:",
    //     status,
    //     "ACTION:",
    //     action
    // );
    // console.log(joyrideState);
    if (type === "step:before" && index === 1) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToExpenses: true,
        }));
    } else if (type === "step:before" && index === 2) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToDebts: true,
        }));
    } else if (type === "step:before" && index === 3) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToSettlement: true,
        }));
    } else if (type === "step:before" && index === 4) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToMembers: true,
        }));
    } else if (type === "step:before" && index === 5) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToActivities: true,
        }));
    } else if (type === "step:before" && index === 6) {
        setJoyrideState((prev) => ({
            ...prev,
            redirectToJoin: true,
        }));
    } else if (type === "step:after" && action === ACTIONS.NEXT) {
        setJoyrideState((prev) => {
            prev.stepIndex = prev.stepIndex + 1;
            return { ...prev };
        });
    } else if (type === "step:after" && action === ACTIONS.PREV) {
        setJoyrideState((prev) => {
            prev.stepIndex = prev.stepIndex - 1;
            return { ...prev };
        });
    }
    if (type === "tour:end") {
        setJoyrideState({
            run: false,
            steps: STEP,
            stepIndex: 0,
            paused: false, // 新增 paused 屬性
        });
    }
};

export { STEP, handleJoyrideCallback };
