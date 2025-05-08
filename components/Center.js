"use client"

import styled from "styled-components";

const StyledDiv = styled.div`
    background-color: #c5f0c2;
    margin: 0 auto;
    position: relative;
    @media screen and (max-width: 768px) {
        padding-top: 90px;
    }
    @media screen and (min-width: 768px) {
        padding-top: 130px;
    }

`;

export default function Center({children}) {
    return (
        <StyledDiv>{children}</StyledDiv>
    )
}