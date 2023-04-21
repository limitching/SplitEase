import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/Home/index";
import Group from "./pages/Group";
import Overview from "./pages/Group/pages/Overview";
import Expenses from "./pages/Group/pages/Expenses";
import Debts from "./pages/Group/pages/Debts";
import Settlement from "./pages/Group/pages/Settlement";
import Members from "./pages/Group/pages/Members";
import Activities from "./pages/Group/pages/Activities";
import Join from "./pages/Group/pages/Join";

// import reportWebVitals from "./reportWebVitals";

// import App from "./pages/app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    //     <App />
    // </React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                {/* <Route index element={<Home />} /> */}
                <Route path="group/:slug" element={<Group />}>
                    <Route path="overview" element={<Overview />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="debts" element={<Debts />} />
                    <Route path="settlement" element={<Settlement />} />
                    <Route path="members" element={<Members />} />
                    <Route path="join" element={<Join />} />
                    <Route path="activities" element={<Activities />} />
                </Route>
                <Route path="login" element={<Login />}></Route>
                <Route path="home" element={<Home />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
