/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./footerBlock.css";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";

const FooterText = styled.h4`
    color: "black";
`;

function FooterBlock() {
    return (
        <>
            <footer id="footer" className="footer-area pt-200">
                <div className="container">
                    <div className="footer-widget pb-100">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-8">
                                <div
                                    className="footer-about mt-200 wow fadeIn"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                >
                                    <a className="logo" href="#">
                                        <img
                                            src="assets/images/logo.svg"
                                            alt="logo"
                                        />
                                    </a>

                                    <FooterText>
                                        <br></br>
                                        Your bill splitting assistant
                                    </FooterText>
                                    <div style={{ marginTop: "2rem" }}>
                                        <Tooltip title="LinedIn">
                                            <a
                                                href="https://www.linkedin.com/in/limitching/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    aria-label="add an alarm"
                                                >
                                                    <img
                                                        src="/assets/images/linkedin.png"
                                                        alt="Linkedin icon"
                                                        style={{
                                                            width: "30px",
                                                        }}
                                                    ></img>
                                                </IconButton>
                                            </a>
                                        </Tooltip>
                                        <Tooltip title="Github">
                                            <a
                                                href="https://github.com/limitching"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    aria-label="add an alarm"
                                                >
                                                    <img
                                                        src="/assets/images/github.png"
                                                        alt="Github icon"
                                                        style={{
                                                            width: "30px",
                                                        }}
                                                    ></img>
                                                </IconButton>
                                            </a>
                                        </Tooltip>
                                        <Tooltip title="Swagger">
                                            <a
                                                href="#"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    aria-label="add an alarm"
                                                >
                                                    <img
                                                        src="/assets/images/swagger.png"
                                                        alt="Swagger"
                                                        style={{
                                                            width: "30px",
                                                        }}
                                                    ></img>
                                                </IconButton>
                                            </a>
                                        </Tooltip>
                                    </div>
                                    <p
                                        className="text"
                                        style={{ color: "black" }}
                                    >
                                        Copyright © 2023 SplitEase. All rights
                                        reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="particles-2"
                    style={{
                        padding: "0",
                        margin: "0",
                        height: "698px",
                        backgroundColor: "transparent",
                    }}
                ></div>
            </footer>
        </>
    );
}

export default FooterBlock;
