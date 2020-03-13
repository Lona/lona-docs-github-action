import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";
import path from "path";

import { capitalise, Tree } from "./utils";
import Spacer from "./Spacer";

const Wrapper = styled.nav`
  flex: 0 0 350px;
  margin-top: 0;
  // border-right: 1px solid rgba(0, 0, 0, 0.08);

  // background: rgb(245, 245, 245);

  @media (max-width: 1600px) {
    flex: 0 0 300px;
  }

  @media (max-width: 1280px) {
    flex: 0 0 240px;
  }
`;

const InnerWrapper = styled.div`
  padding: 32px 0 32px 65px;
  height: calc(100vh - 120px);
  overflow-y: auto;
`;

const NavigationWrapper = styled.nav`
  flex: 0 0 auto;
`;

const ItemWrapper = styled.li`
  & + li {
    margin-top: 12px;
  }
`;

const NavigationItem = styled(Link)<{ selected: boolean }>`
  height: 32px;
  display: flex;
  align-items: center;
  text-decoration: ${props => (props.selected ? `underline` : `none`)};
  color: #000000;
  font-size: 18px;
  font-weight: ${props => (props.selected ? `700` : `inherit`)};
`;

const Section = styled(ItemWrapper)`
  padding: 28px 0;
`;

const NestedItemList = styled.ul`
  padding-left: 16px;
  padding-top: 12px;
`;

const SectionHeader = styled.span<{ selected: boolean }>`
  text-transform: uppercase;
`;

const SubsectionHeader = styled.span<{ selected: boolean }>``;

function formatName(name: string) {
  return capitalise(decodeURIComponent(path.basename(name)));
}

function isSelected(location: Location, name: string) {
  const prefixedPath = withPrefix(name);
  return (
    location.pathname == prefixedPath || location.pathname == `${prefixedPath}/`
  );
}

function isDescendantSelected(location: Location, name: string) {
  const prefixedPath = withPrefix(name);
  return location.pathname.startsWith(prefixedPath);
}

const Bullet = styled.span`
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #525252;
`;

const SidebarItem = ({
  location,
  item: { name, children },
  depth = 0
}: {
  location: Location;
  item: Tree;
  depth?: number;
}) => {
  const selected = isSelected(location, name);
  const descendantSelected = isDescendantSelected(location, name);

  return (
    <ItemWrapper key={name}>
      <NavigationItem to={`/${name}`} selected={selected}>
        {depth > 0 && (
          <>
            <Bullet />
            <Spacer horizontal size={10} />
          </>
        )}
        <SubsectionHeader selected={selected}>
          {formatName(name)}
        </SubsectionHeader>
      </NavigationItem>
      {/* Always show the first level of descendants, but hide the rest unless something is selected */}
      {children.length > 0 && (depth <= 1 || descendantSelected) ? (
        <NestedItemList>
          {children.map(file => (
            <SidebarItem location={location} item={file} depth={depth + 1} />
          ))}
        </NestedItemList>
      ) : null}
    </ItemWrapper>
  );
};

const Sidebar = ({
  location,
  fileTree
}: {
  location: Location;
  fileTree: Tree;
}) => {
  const files = fileTree.children;

  // If we only have an index page, don't render the sidebar
  if (files.length === 0) return null;

  return (
    <Wrapper>
      <InnerWrapper>
        <NavigationWrapper aria-label="Primary navigation">
          <ul>
            {files.map(file => (
              <SidebarItem key={file.name} location={location} item={file} />
            ))}
          </ul>
        </NavigationWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Sidebar;
