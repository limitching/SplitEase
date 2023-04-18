import DebtsBlock from "./components/DebtsBlock";

import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";

const Debts = () => {
    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Settle debts</h6>
                </HeaderTextContainer>
                <ListWrapper>
                    <DebtsBlock></DebtsBlock>
                </ListWrapper>
            </PageWrapper>
        </>
    );
};

export default Debts;
