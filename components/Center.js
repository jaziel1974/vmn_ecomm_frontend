import styled from "styled-components";

const StyledDiv = styled.div`
    background-color: #c5f0c2;
    margin: 0 auto;
    position: relative;
`;

export default function Center({children}) {
    return (
        <StyledDiv>{children}</StyledDiv>
    );
}