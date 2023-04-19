import {
    PageWrapper,
    ListWrapper,
    HeaderTextContainer,
} from "../../components/PageWrapper";
import MemberList from "./components/MemberList";

const Members = () => {
    return (
        <>
            <PageWrapper>
                <HeaderTextContainer>
                    <h6>Members</h6>
                </HeaderTextContainer>
                <ListWrapper>
                    <MemberList></MemberList>
                </ListWrapper>
            </PageWrapper>
        </>
    );
};
export default Members;
