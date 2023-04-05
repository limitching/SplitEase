import Transaction from "./components/Transaction";
import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";

async function fetchMembers(gid, setMembers) {
    try {
        const data = await api.getMembers(gid);
        setMembers(data);
    } catch (error) {
        console.error(error);
    }
}

async function fetchCurrencies(setCurrencies) {
    try {
        const data = await api.getCurrencies();
        setCurrencies(data);
    } catch (error) {
        console.error(error);
    }
}

const Group = () => {
    const [members, setMembers] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [checked, setChecked] = useState([]);
    // const isInitialMount = useRef(true);
    useEffect(() => {
        // if (isInitialMount.current) {
        //     isInitialMount.current = false;
        // } else {
        const gid = "backendawesome";
        fetchMembers(gid, setMembers);
        fetchCurrencies(setCurrencies);
        // }
    }, []);

    useEffect(() => {
        if (members !== null) {
            setChecked([...members]);
        }
    }, [members]);

    return (
        <div>
            <div
                className="group-information"
                style={{
                    display: "block",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "blue",
                }}
            ></div>
            <h1 style={{ marginTop: "3rem" }}>Hello</h1>
            <Transaction
                members={members}
                currencies={currencies}
                checked={checked}
                setChecked={setChecked}
            />
        </div>
    );
};

export default Group;
