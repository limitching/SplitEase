import React from "react";
import styled from "styled-components";

const StyledLink = styled.a`
    display: inline-block;
    position: relative;
    text-decoration: none;
`;

function LearnMore() {
    function handleClick() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <StyledLink href="#" onClick={handleClick}>
            <strong>Learn More ➤</strong>
        </StyledLink>
    );
}

export default LearnMore;
