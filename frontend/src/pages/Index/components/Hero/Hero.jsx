import React from "react";
import "./hero.css";
import "./animate.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

const HeroText = styled.p`
    font-size: 1.25rem;
`;

function Hero() {
    const navigate = useNavigate();
    return (
        <div
            id="home"
            className="header-hero bg_cover"
            style={{
                backgroundImage: "url(/assets/images/banner-bg.svg)",
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="header-hero-content text-center">
                            <h1
                                className="wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.1s"
                            >
                                <strong>Splitting expenses made simple</strong>
                            </h1>
                            <br></br>
                            <HeroText
                                className="wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.3s"
                            >
                                <strong>
                                    Track expenses and settle up effortlessly
                                    with the ultimate expense-splitting
                                    solution.
                                </strong>
                            </HeroText>

                            <HeroButton
                                className="main-btn wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.7s"
                                onClick={() => {
                                    navigate("/login");
                                }}
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
