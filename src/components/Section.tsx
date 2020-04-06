import React from "react";
import styled from "styled-components";
import { colors, sizes } from "../foundation";

const Section = styled.main`
  color: ${colors.text};
  padding: 120px 60px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: ${sizes.breakpoints.medium}) {
    max-width: 960px;
  }

  @media (max-width: ${sizes.breakpoints.small}) {
    max-width: 800px;
  }
`;

const Wrapper = styled.section`
  flex: 1 1 auto;
  margin: 0;
  height: 100vh;
  overflow-y: scroll;
`;

export default (props: { children: React.ReactNode }) => (
  <Wrapper>
    <Section {...props} />
  </Wrapper>
);
