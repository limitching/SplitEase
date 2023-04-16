import { useContext } from "react";
import { GroupContext } from "../../../contexts/GroupContext";
const GroupDashboard = () => {
    const { group } = useContext(GroupContext);
    return (
        <div
            className="group-information"
            style={{
                width: "100%",
                height: "300px",
                backgroundColor: "lightblue",
                fontSize: "5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <h1>{group.name}</h1>
            <h3>{group.description}</h3>
            Group Dashboard 預定地
        </div>
    );
};
export default GroupDashboard;
