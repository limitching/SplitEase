import styled from "styled-components";
import { Paper } from "@mui/material";

const PageWrapper = styled(Paper)`
    width: 90%;
    min-height: 42vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background-color: white;
    margin: 1rem auto;
    overflow: scroll;

    @media (min-width: 768px) {
        width: 45%;
        min-height: calc(50vh + 56px);
        margin: 1.5rem auto;
    }
`;

const ListWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background-color: white;
    margin: 0 auto;
`;

const FixedButtonWrapper = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 80px;
    left: 0;
    width: 100%;
    padding: 20px;
`;

const HeaderTextContainer = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-top: 1rem;
`;

export { PageWrapper, ListWrapper, FixedButtonWrapper, HeaderTextContainer };
