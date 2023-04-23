import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";
import SettlingDebtsBlock from "./components/SettlingDebtsBlock";

const Settlement = () => {
    return (
        <PageWrapper>
            <HeaderTextContainer>
                <h6>Settling debts (Debts in settling process...)</h6>
            </HeaderTextContainer>
            <ListWrapper>
                <SettlingDebtsBlock></SettlingDebtsBlock>
            </ListWrapper>
        </PageWrapper>
    );
};
export default Settlement;
