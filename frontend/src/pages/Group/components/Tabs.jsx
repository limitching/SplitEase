import styled from "styled-components";
import { GROUP_TABS } from "../../../global/constant";
import { Link, useNavigate } from "react-router-dom";

const CategoryLink = styled.a`
    display: inline;
    font-size: 16px;
    margin-right: 20px;
    padding-bottom: 8px;
    letter-spacing: 6px;
    padding-left: 10px;
    padding-right: 6px;
    position: relative;
    text-decoration: none;
    color: ${(props) => props.theme.textColor};
    background: linear-gradient(
            to right,
            ${(props) => props.theme.textColor},
            ${(props) => props.theme.textColor}
        ),
        linear-gradient(
            to right,
            #ffb751,
            rgba(255, 0, 180, 1),
            rgb(48, 152, 255)
        );
    background-size: 100% 4px, 0 4px;
    background-size: ${(props) =>
        props.$isActive ? "0 4px, 100% 4px" : props.theme.textColor};
    background-position: 100% 100%, 0 100%;
    background-repeat: no-repeat;
    transition: background-size 400ms;

    &:hover {
        cursor: pointer;
        background-size: 0 4px, 100% 4px;

        @media screen and (max-width: 1279px) {
            color: white;
        }
    }

    @media screen and (max-width: 1279px) {
        font-size: 16px;
        letter-spacing: normal;
        padding: 0;
        text-align: center;
        color: ${(props) => (props.$isActive ? "white" : "#828282")};
        line-height: 50px;
        flex-grow: 1;
    }

    & + &::before {
        content: "";
        position: absolute;
        left: 0;
        color: ${(props) => props.theme.textColor};

        @media screen and (max-width: 1279px) {
            color: #828282;
        }
    }
`;

const Tabs = () => {
    const navigate = useNavigate();
    return (
        <div
            className="group-information"
            style={{
                width: "100%",
                height: "50px",
                backgroundColor: "lightgray",
                fontSize: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {GROUP_TABS.map(({ name, displayText }, index) => (
                <CategoryLink
                    $isActive={name}
                    key={index}
                    onClick={() => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                        navigate(name);
                    }}
                >
                    {displayText}
                </CategoryLink>
            ))}
        </div>
    );
};
export default Tabs;
