function inputFormatter(event) {
    removeSingleMinus(event);
    handleMinus(event);
    removeLeadingZeros(event);
    return;
}

function handleMinus(event) {
    // If input start with "-", remain it and remove the following "-"
    if (event.target.value.startsWith("-")) {
        event.target.value = "-" + event.target.value.replace(/-/g, "");
    }

    // If input end with "-", add "-" to the front
    if (event.target.value.endsWith("-")) {
        event.target.value = "-" + event.target.value.slice(0, -1);
        return "-" + event.target.value.slice(0, -1);
    }

    return event.target.value;
}
function removeSingleMinus(event) {
    // Input equal to "-", change it to 0
    if (event.target.value === "-") {
        event.target.value = "0";
        return "0";
    }
}
function removeAllMinus(event) {
    event.target.value = event.target.value.replace(/-/g, "");
}

function amountFormatter(event) {
    removeSingleMinus(event);
    removeAllMinus(event);
    removeLeadingZeros(event);
}

const removeLeadingZeros = (event) => {
    console.log(event.target.value);
    if (event.target.value === "0" || event.target.value === "00") {
        event.target.value = "0";
        return "0";
    }
    event.target.value = event.target.value.replace(/^0+/, "");
    return event.target.value.replace(/^0+/, "");
};
export { removeLeadingZeros, handleMinus, inputFormatter, amountFormatter };
