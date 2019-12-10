import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";
import { HeaderHeight } from "./ui-constants";
import { capitalise, Tree } from "./utils";

const Wrapper = styled.nav`
  flex: 0 0 350px;
  margin-top: 0;

  @media (max-width: 1600px) {
    flex: 0 0 300px;
  }

  @media (max-width: 1280px) {
    flex: 0 0 240px;
  }
`;

const InnerWrapper = styled.div`
  padding-left: 66px;
  height: calc(100vh - ${HeaderHeight});
  overflow-y: auto;
`;

const NavigationWrapper = styled.nav`
  flex: 0 0 auto;
`;

const ItemWrapper = styled.li``;

const NavigationItem = styled(Link)`
  text-decoration: none;
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

const Sidebar = ({ location, files }: { location: Location; files: Tree }) => {
  return (
    <Wrapper>
      <InnerWrapper>
        <NavigationWrapper aria-label="Primary navigation">
          <ul>
            {files.map(section => {
              return (
                <Section key={section.name}>
                  <NavigationItem to={`/${section.name}`}>
                    <SectionHeader
                      selected={isSelected(location, section.name)}
                    >
                      {decodeURIComponent(section.name)}
                    </SectionHeader>
                  </NavigationItem>
                  {section.children.length ? (
                    <ul>
                      {section.children.map(subsection => {
                        const selected = isSelected(location, subsection.name);
                        return (
                          <ItemWrapper key={subsection.name}>
                            <NavigationItem to={`/${subsection.name}`}>
                              <SubsectionHeader selected={selected}>
                                {capitalise(
                                  decodeURIComponent(subsection.name)
                                )}
                              </SubsectionHeader>
                            </NavigationItem>
                            {selected && (
                              <SubNavigation
                                subsection={subsection.children}
                                location={location}
                              />
                            )}
                          </ItemWrapper>
                        );
                      })}
                    </ul>
                  ) : null}
                </Section>
              );
            })}
          </ul>
        </NavigationWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Sidebar;
