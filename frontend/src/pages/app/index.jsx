import Transaction from "./components/Transaction";
import Header from "../home/components/Header";
import Footer from "../home/components/Footer";

const App = () => {
    return (
        <div>
            <Header></Header>
            <div
                className="group-information"
                style={{
                    display: "block",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "blue",
                }}
            ></div>
            <h1 style={{ marginTop: "4rem" }}>Hello</h1>
            <Transaction />
            <Footer></Footer>
        </div>
    );
};

export default App;
