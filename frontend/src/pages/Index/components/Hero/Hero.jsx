import React from "react";
import "./hero.css";
import "./animate.css";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCallback, useRef, useEffect } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

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

const HeroContainer = styled.div`
    position: relative; // add this to enable positioning of particles
    height: 100%;
    overflow: hidden;

    canvas {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: -1 !important;
        overflow: hidden !important;
    }
`;

const HeroText = styled.p`
    font-size: 1.25rem;
`;

function Hero() {
    const navigate = useNavigate();

    const particlesInit = useCallback(async (engine) => {
        // console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        // await console.log(container);
    }, []);

    const particlesParams = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800,
                },
            },
            color: {
                value: "#ffffff",
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000",
                },
                polygon: {
                    nb_sides: 5,
                },
                image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100,
                },
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false,
                },
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false,
                },
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200,
                },
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse",
                },
                onclick: {
                    enable: true,
                    mode: "push",
                },
                resize: true,
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1,
                    },
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
                push: {
                    particles_nb: 4,
                },
                remove: {
                    particles_nb: 2,
                },
            },
        },
        retina_detect: true,
    };

    return (
        <div
            id="home"
            className="header-hero bg_cover"
            style={{
                position: "relative",
                backgroundImage: "url(/assets/images/banner-bg.svg)",
                overflow: "hidden",
            }}
        >
            <HeroContainer className="container" style={{ overflow: "hidden" }}>
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
                <Particles
                    id="particles-1"
                    className="particles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={particlesParams}
                    canvasClassName="particles-js-canvas-el "
                    container={HeroContainer}
                    width="100%"
                    height="30vh"
                />
            </HeroContainer>
        </div>
    );
}

export default Hero;
