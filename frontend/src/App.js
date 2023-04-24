import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./contexts/AuthContext";
import { GroupContextProvider } from "./contexts/GroupContext";
import { LiffProvider } from "react-liff";
import { LIFF_ID } from "./global/constant";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <LiffProvider liffId={LIFF_ID}>
                    <AuthContextProvider>
                        <GroupContextProvider>
                            <Header></Header>
                            <Outlet />
                            <Footer></Footer>
                        </GroupContextProvider>
                    </AuthContextProvider>
                </LiffProvider>
            </LocalizationProvider>
        </>
    );
}

export default App;
