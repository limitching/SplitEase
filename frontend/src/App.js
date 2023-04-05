import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <>
            <Header></Header>
            <Outlet />
            <Footer></Footer>;
        </>
    );
}

export default App;
