import styled from "styled-components";
import { colors } from "../foundation";

const css = `
  color: ${colors.text};
  display: inline-block;
  min-width: 300px;
  border: 1px solid ${colors.divider};
  text-align: center;
  text-decoration: none;
  background: ${colors.contentBackground};
  padding: 3px 20px;
  border-radius: 3px;

  &:hover {
    background: ${colors.blockBackground};
  }
`;

export const Button = styled.button`
  ${css}
`;

export const Link = styled.a`
  ${css}
`;
