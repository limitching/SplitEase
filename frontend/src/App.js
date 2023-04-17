import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./contexts/AuthContext";
import { GroupContextProvider } from "./contexts/GroupContext";

function App() {
    return (
        <>
            <AuthContextProvider>
                <GroupContextProvider>
                    <Header></Header>
                    <Outlet />
                    <Footer></Footer>
                </GroupContextProvider>
            </AuthContextProvider>
        </>
    );
}

export default App;
