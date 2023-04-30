import "./features.css";
import styled from "styled-components";
import LearnMore from "../LearnMore";
import { Col, Container, Row } from "react-bootstrap";

const StyledContainer = styled(Container)`
    width: 90vw;

    @media (min-width: 768px) {
        width: 85vw;
    }

    @media (min-width: 992px) {
        width: 80vw;
    }

    @media (min-width: 1200px) {
        width: 75vw;
    }
`;

const Features = () => {
    return (
        <div>
            <section id="features" className="services-area pt-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="section-title text-center pb-40">
                                <div className="line m-auto"></div>
                                <h3 className="title">
                                    Effortlessly split bills with SplitEase.
                                </h3>
                            </div>
                        </div>
                    </div>
                    <StyledContainer>
                        <div className="row justify-content-center">
                            {/* Efficient */}
                            <Col xl={3} lg={6} md={6} sm={8}>
                                <div
                                    className="single-services text-center mt-30 wow fadeIn"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                >
                                    <div className="services-icon">
                                        <img
                                            className="shape"
                                            src="assets/images/services-shape.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/services-shape-1.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/energy.png"
                                            alt="Efficient"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></img>
                                    </div>

                                    <div className="services-content mt-30">
                                        <div className="services-title">
                                            <h1>Efficient</h1>
                                        </div>
                                        <p className="text">
                                            Split bills quickly and effortlessly
                                            with SplitEase, saving you time and
                                            energy.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            {/* Accessible */}
                            <Col xl={3} lg={6} md={6} sm={8}>
                                <div
                                    className="single-services text-center mt-30 wow fadeIn"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                >
                                    <div className="services-icon">
                                        <img
                                            className="shape"
                                            src="assets/images/services-shape.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/services-shape-1.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/high-five.png"
                                            alt="Efficient"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></img>
                                    </div>
                                    <div className="services-content mt-30">
                                        <div className="services-title">
                                            <h1>Accessible</h1>
                                        </div>
                                        <p className="text">
                                            SplitEase's user-friendly interface
                                            makes bill splitting accessible to
                                            everyone.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            {/* Simple */}
                            <Col xl={3} lg={6} md={6} sm={8}>
                                <div
                                    className="single-services text-center mt-30 wow fadeIn"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                >
                                    <div className="services-icon">
                                        <img
                                            className="shape"
                                            src="assets/images/services-shape.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/services-shape-1.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/thumbs-up.png"
                                            alt="Efficient"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></img>
                                    </div>
                                    <div className="services-content mt-30">
                                        <div className="services-title">
                                            <h1>Simple</h1>
                                        </div>
                                        <p className="text">
                                            Simplify bill splitting with
                                            SplitEase's straightforward design
                                            and easy-to-use features.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            {/* Yielding */}
                            <Col xl={3} lg={6} md={6} sm={8}>
                                <div
                                    className="single-services text-center mt-30 wow fadeIn"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                >
                                    <div className="services-icon">
                                        <img
                                            className="shape"
                                            src="assets/images/services-shape.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/services-shape-1.svg"
                                            alt="shape"
                                        />
                                        <img
                                            className="shape-1"
                                            src="assets/images/target.png"
                                            alt="Efficient"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></img>
                                    </div>
                                    <div className="services-content mt-30">
                                        <div className="services-title">
                                            <h1>Yielding</h1>
                                        </div>
                                        <p className="text">
                                            Ensure precision in bill splitting
                                            with SplitEase's advanced
                                            calculation technology.
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </StyledContainer>
                </div>
            </section>
        </div>
    );
};

export default Features;
