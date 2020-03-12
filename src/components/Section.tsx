import styled from "styled-components";
import { Colors } from "./ui-constants";

const Section = styled.section`
  flex: 1 1 auto;
  color: ${Colors.text};
  padding: 40px 60px;
  max-width: 1120px;
  margin: 0 auto;

  @media (max-width: 1600px) {
    max-width: 960px;
  }

  @media (max-width: 1280px) {
    max-width: 800px;
  }
`;

export default Section;
