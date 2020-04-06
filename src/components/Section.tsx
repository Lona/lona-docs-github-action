import styled from "styled-components";
import { colors, sizes } from "../foundation";

const Section = styled.section`
  flex: 1 1 auto;
  color: ${colors.text};
  padding: 120px 60px;
  max-width: 1120px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: scroll;

  @media (max-width: ${sizes.breakpoints.medium}) {
    max-width: 960px;
  }

  @media (max-width: ${sizes.breakpoints.small}) {
    max-width: 800px;
  }
`;

export default Section;
