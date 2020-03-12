import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";
import { capitalise, Tree } from "./utils";

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
  height: 32px;
  display: flex;
  align-items: center;

  & + li {
    margin-top: 12px;
  }
`;

const NavigationItem = styled(Link)`
  text-decoration: none;
  color: #000000;
  font-size: 18px;
`;

const Section = styled(ItemWrapper)`
  padding: 28px 0;
`;

const SubTitles = styled.ul`
  padding-left: 10px;
`;

const SectionHeader = styled.span<{ selected: boolean }>`
  text-transform: uppercase;
`;
const SubsectionHeader = styled.span<{ selected: boolean }>``;
const SubSubsectionHeader = styled.span<{ selected: boolean }>``;

function isSelected(location: Location, section: string) {
  const prefixedPath = withPrefix(section);
  return location.pathname.indexOf(prefixedPath) === 0;
}

const SubNavigation = ({
  subsection,
  location
}: {
  subsection: Tree;
  location: Location;
}) => {
  return (
    <SubTitles>
      {subsection.map(subsubSection => (
        <li>
          <NavigationItem to={subsubSection.name}>
            <SubSubsectionHeader
              selected={isSelected(location, subsubSection.name)}
            >
              {capitalise(subsubSection.name)}
            </SubSubsectionHeader>
          </NavigationItem>
        </li>
      ))}
    </SubTitles>
  );
};

const SidebarItem = ({
  name,
  selected
}: {
  name: string;
  selected: boolean;
}) => {
  return (
    <ItemWrapper key={name}>
      <NavigationItem to={`/${name}`}>
        <SubsectionHeader selected={selected}>
          {capitalise(decodeURIComponent(name))}
        </SubsectionHeader>
      </NavigationItem>
      {/* {selected && (
        <SubNavigation
          subsection={children}
          location={location}
        />
      )} */}
    </ItemWrapper>
  );
};

const Sidebar = ({ location, files }: { location: Location; files: Tree }) => {
  if (files.length === 0) return null;
  // return null;

  return (
    <Wrapper>
      <InnerWrapper>
        <NavigationWrapper aria-label="Primary navigation">
          <ul>
            {files.map(file => {
              return file.children.length === 0 ? (
                <SidebarItem
                  name={file.name}
                  selected={isSelected(location, file.name)}
                />
              ) : (
                <SidebarItem
                  name={file.name}
                  selected={isSelected(location, file.name)}
                />
              );

              // return (
              //   <Section key={file.name}>
              //     <NavigationItem to={`/${file.name}`}>
              //       <SectionHeader
              //         selected={isSelected(location, file.name)}
              //       >
              //         {decodeURIComponent(file.name)}
              //       </SectionHeader>
              //     </NavigationItem>
              //     {file.children.length ? (
              //       <ul>
              //         {file.children.map(subsection => {
              //           const selected = isSelected(location, subsection.name);

              //         })}
              //       </ul>
              //     ) : null}
              //   </Section>
              // );
            })}
          </ul>
        </NavigationWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Sidebar;
