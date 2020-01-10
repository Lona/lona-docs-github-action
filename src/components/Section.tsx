import styled from "styled-components";
import { Colors } from "./ui-constants";

const Section = styled.section`
  position: relative;
  z-index: 800;
  flex: 1 1 auto;
  border-radius: 0.6rem;
  min-width: 0;
  max-width: calc(100vw - 350px);

  color: ${Colors.text};
  padding: 160px 120px;

  @media (max-width: 1600px) {
    max-width: calc(100vw - 300px);
  }

  @media (max-width: 1280px) {
    max-width: calc(100vw - 240px);
  }
`;

export default Section;
