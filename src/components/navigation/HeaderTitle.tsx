import React, { ReactNode } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Spacer from "../Spacer";

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
  font-size: 18px;
  font-weight: 500;
  color: #000000;
`;

const Image = styled.img`
  width: 36px;
  height: 36px;
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
    <Spacer horizontal size={20} />
    <Label>{children}</Label>
  </Container>
);
