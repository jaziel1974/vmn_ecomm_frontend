import styled from "styled-components";

const StyledDiv = styled.div`
    background-color: #c5f0c2;
    margin: 0 auto;
    position: relative;
    padding-top: 30px;

`;

export default function Center({children}) {
    return (
        <StyledDiv>{children}</StyledDiv>
    )
}