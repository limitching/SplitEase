import Preloader from "../../components/Preloader/Preloader";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import FooterBlock from "./components/FooterBlock/FooterBlock";
import About from "./components/About/About";
import Team from "./components/Team/Team";
import Blog from "./components/Blog/Blog";

const Index = () => {
    return (
        <div>
            <Hero></Hero>
            {/* <div
                style={{
                    width: "100%",
                    height: "15vh",
                    border: "1px solid black",
                }}
            ></div> */}
            <Features></Features>

            <About></About>
            <Team></Team>
            <Blog></Blog>
            <FooterBlock></FooterBlock>
        </div>
    );
};
export default Index;
