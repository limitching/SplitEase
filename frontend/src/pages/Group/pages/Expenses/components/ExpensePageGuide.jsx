import React from "react";
import Joyride from "react-joyride";

export default class App extends React.Component {
    state = {
        steps: [
            {
                target: "#expense-block",
                content:
                    "Here shows the all the expenses record related to this group.",
                placement: "top",
            },
            {
                target: "#create-expense",
                content: "Click to create an Expense.",
            },
            {
                target: "#expense-button",
                content: "Here shows the expense detail.",
            },

            {
                target: "#expense-button",
                content:
                    "If you want to edit the inserted Expense, \nyou can click the expense to enter Edit Modal.",
            },
        ],
    };

    render() {
        const { steps } = this.state;

        return (
            <div className="app">
                <Joyride
                    steps={steps}
                    continuous
                    hideCloseButton
                    scrollToFirstStep
                    showProgress
                    showSkipButton
                    disableScrolling
                />
            </div>
        );
    }
}
