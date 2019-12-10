import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { HeaderHeight } from "./ui-constants";

const Wrapper = styled.header`
  height: ${HeaderHeight};
  padding-right: 65px;
  padding-left: 65px;
`;

const InnerWrapper = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  text-decoration: none;
`;

// const NavigationWrapper = styled.nav`
//   display: flex;
// `;

// const Navigation = styled.ul`
//   display: flex;
// `;

// const NavigationItem = styled(Link)`
//   text-transform: capitalize;
//   text-decoration: none;
// `;

// const HeaderNavigationLink = styled.span<{ selected: boolean }>``;

// const NavigationItemWrapper = styled.li<{ first: boolean }>(props => ({
//   display: "flex",
//   alignItems: "center",
//   marginLeft: props.first ? "0" : `${65 - 24}px`
// }));

const Header = () => (
  <Wrapper>
    <InnerWrapper>
      <Logo aria-label="Back to Home" to="/"></Logo>
    </InnerWrapper>
  </Wrapper>
);

export default Header;
