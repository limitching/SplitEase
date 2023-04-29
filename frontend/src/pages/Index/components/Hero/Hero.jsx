import React from "react";
import "./hero.css";
import "./animate.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const HeroButton = styled(Button)`
    background-color: #0066cc;
    color: #fff;
    border-radius: 30px;
    font-size: 24px;
    padding: 10px 20px;
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;

    &:hover {
        background-color: #0052a3;
    }
`;

function Hero() {
    return (
        <div
            id="home"
            className="header-hero bg_cover"
            style={{
                backgroundImage: "url(/assets/images/banner-bg.svg)",
                // height: "800px",
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="header-hero-content text-center">
                            <h2
                                className="header-title wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.1s"
                            >
                                Splitting expenses made simple with SplitEase
                            </h2>
                            <h3
                                className="header-sub-title wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.3s"
                            >
                                <strong>
                                    Track expenses and settle up effortlessly
                                </strong>
                            </h3>
                            <p
                                className="text wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.5s"
                            >
                                <strong>SplitEase</strong> - The ultimate
                                expense-splitting solution. Try it now!
                            </p>
                            <HeroButton
                                className="main-btn wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.7s"
                            >
                                Get Started
                            </HeroButton>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div
                            className="header-hero-image text-center wow fadeIn"
                            data-wow-duration="1s"
                            data-wow-delay="0.7s"
                        >
                            <img src="/assets/images/output.png" alt="hero" />
                        </div>
                    </div>
                </div>
            </div>
            <div id="particles-1" className="particles"></div>
        </div>
    );
}

export default Hero;
