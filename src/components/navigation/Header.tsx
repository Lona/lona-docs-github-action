import React from "react";
import styled from "styled-components";
import HeaderTitle from "./HeaderTitle";

const Container = styled.header`
  padding: 42px 65px;
  display: flex;
  align-items: center;
`;

export default ({}: {}) => (
  <Container>
    <HeaderTitle iconUrl="">Workspace Title</HeaderTitle>
  </Container>
);
