/* eslint-disable jsx-a11y/anchor-is-valid */
import "./team.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
const Team = () => {
    return (
        <section
            id="team"
            className="team-area pt-120"
            style={{ position: "relative", zIndex: "5" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="section-title text-center pb-30">
                            <div className="line m-auto"></div>
                            <strong>
                                <h3 className="title">
                                    <span>Meet Our</span> Creative Team Member
                                </h3>
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-7 col-sm-8">
                        <div
                            className="single-team text-center mt-30 wow fadeIn"
                            data-wow-duration="1s"
                            data-wow-delay="0.3s"
                        >
                            <div className="team-image">
                                <img
                                    src="assets/images/hire_me.png"
                                    alt="Team"
                                />
                                <div
                                    className="social"
                                    style={{
                                        display: "flex",
                                        height: "4rem",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ul
                                        style={{
                                            height: "4rem",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <li>
                                            <a
                                                href="https://github.com/limitching"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaGithub
                                                    style={{ fontSize: "2rem" }}
                                                ></FaGithub>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.linkedin.com/in/limitching/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaLinkedin
                                                    style={{ fontSize: "2rem" }}
                                                ></FaLinkedin>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="team-content">
                                <h5 className="holder-name">
                                    <a href="#">HUNG WEI-CHING</a>
                                </h5>
                                <p className="text">
                                    Backend Software Engineer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;
