import React, { ReactNode } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Spacer from "./Spacer";
import { colors } from "../foundation";

const Container = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 0.7;
  }
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.text};
`;

const Image = styled.img`
  width: 24px;
  height: 24px;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.15);
  border: none;
  outline: none;
`;

export default ({
  iconUrl,
  children
}: {
  iconUrl: string;
  children: ReactNode;
}) => (
  <Container to="/">
    <Image src={iconUrl || undefined} />
    <Spacer horizontal size={10} />
    <Label>{children}</Label>
  </Container>
);
