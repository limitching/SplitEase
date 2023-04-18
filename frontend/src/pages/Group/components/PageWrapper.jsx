import styled from "styled-components";
import { Paper } from "@mui/material";

const PageWrapper = styled(Paper)`
    width: 45%;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background-color: white;
    margin: 2rem auto;
    overflow: scroll;
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

export { PageWrapper, ListWrapper };
