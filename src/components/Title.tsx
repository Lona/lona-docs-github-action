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
  border: none;
  outline: none;
`;

export default ({
  iconUrl,
  children
}: {
  iconUrl: string | null;
  children: ReactNode;
}) => {
  const hasIcon = iconUrl !== null && iconUrl !== "";
  return (
    <Container to="/">
      {hasIcon && <Image src={iconUrl!} />}
      {hasIcon && <Spacer horizontal size={10} />}
      <Label>{children}</Label>
    </Container>
  );
};
