import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
    return (
        <>
            <AuthContextProvider>
                <Header></Header>
                <Outlet />
                <Footer></Footer>
            </AuthContextProvider>
        </>
    );
}

export default App;
