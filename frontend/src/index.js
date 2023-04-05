import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Group from "./pages/Group";
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
                <Route path="group/:gid" element={<Group />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
