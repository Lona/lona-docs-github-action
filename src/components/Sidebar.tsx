import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";
import path from "path";

import { capitalise } from "../utils/format";
import { maxDepth, Tree } from "../utils/tree";
import Spacer from "./Spacer";
import withSeparator from "../utils/separator";
import Title from "./Title";
import { colors, spacing, textStyles, sizes } from "../foundation";

const Wrapper = styled.nav`
  flex: 0 0 300px;
  margin-top: 0;
  border-right: 1px solid ${colors.divider};
  background: ${colors.background};

  @media (max-width: ${sizes.breakpoints.medium}) {
    flex: 0 0 260px;
  }
`;

const InnerWrapper = styled.div`
  // padding: 32px 0;
  overflow-y: auto;
`;

const NavigationWrapper = styled.nav`
  flex: 0 0 auto;
`;

const ItemWrapper = styled.li`
  & + li {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 12px;
  }
`;

const NavigationItem = styled(Link)<{ selected: boolean; depth: number }>`
  ${props => (props.selected ? textStyles.regularBold : textStyles.regular)};
  height: 36px;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding-left: ${props =>
    `${spacing.sidebar.paddingHorizontal +
      Math.max(props.depth - 1, 0) * 20}px`};
`;

const SubsectionHeader = styled.span<{ selected: boolean }>``;

function formatName(name: string) {
  return capitalise(decodeURIComponent(path.basename(name)));
}

function isSelected(location: Location, name: string) {
  const prefixedPath = withPrefix(name);
  return (
    decodeURIComponent(location.pathname) == prefixedPath ||
    `${decodeURIComponent(location.pathname)}/` == prefixedPath
  );
}

function isDescendantSelected(location: Location, name: string) {
  const prefixedPath = withPrefix(name);
  return decodeURIComponent(location.pathname).startsWith(prefixedPath);
}

const Bullet = styled.span`
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #525252;
  margin-left: 2px;
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
    <>
      <NavigationItem to={`/${name}`} selected={selected} depth={depth}>
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
      {children.length > 0 && (depth === 0 || descendantSelected) ? (
        <ul>
          {children.map(file => (
            <SidebarItem location={location} item={file} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </>
  );
};

const Sidebar = ({
  location,
  fileTree,
  title
}: {
  location: Location;
  fileTree: Tree;
  title: string;
}) => {
  const files = fileTree.children;

  // If we only have an index page, don't render the sidebar
  if (files.length === 0) return null;

  const treeDepth = maxDepth(fileTree);

  return (
    <Wrapper>
      <Spacer size={40} />
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          paddingLeft: `${spacing.sidebar.paddingHorizontal}px`
        }}
      >
        <Title iconUrl="">{title}</Title>
      </div>
      <Spacer size={16} />
      <InnerWrapper>
        <NavigationWrapper aria-label="Primary navigation">
          <ul>
            {withSeparator(
              files.map(file => (
                <SidebarItem key={file.name} location={location} item={file} />
              )),
              index => (
                <Spacer
                  key={`separator-${index}`}
                  size={treeDepth > 1 ? 12 : 4}
                />
              )
            )}
          </ul>
        </NavigationWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Sidebar;
