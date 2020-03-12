import React, { ReactNode } from "react";
// import { useStaticQuery } from "gatsby";
// need to import graphql on another line: https://stackoverflow.com/questions/55877659/how-to-fix-gatsby-1-is-undefined
// import { graphql } from "gatsby";
import Helmet from "react-helmet";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Section from "./Section";

import { cleanupFiles } from "./utils";
import { GlobalStyles } from "./globalStyles";
import Header from "./navigation/Header";

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  > * {
    flex: none;
  }
`;

const SkipLink = styled.a`
  position: absolute;
  top: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  height: 1px;
  width: 1px;
  padding: 0;
  border: 0;
`;

const Content = styled.main`
  display: flex;
`;

function hasInputPath(x: { inputPath?: string }): x is { inputPath: string } {
  return !!x.inputPath;
}

const Layout = ({
  children,
  location,
  site,
  allLonaDocumentPage
}: {
  children: ReactNode;
  location: Location;
  site: {
    siteMetadata: { title: string; keywords: string[]; description: string };
  };
  allLonaDocumentPage: {
    nodes: { inputPath: string; children: { inputPath?: string }[] }[];
  };
}) => {
  // TODO: for some reason we can't use `useStaticQuery` here: "The result of this StaticQuery could not be fetched."
  // so instead I'm passing it down as props but it's not really clean
  // const data = useStaticQuery<{
  //   site: {
  //     siteMetadata: { title: string; keywords: string[]; description: string };
  //   };
  //   allLonaDocumentPage: {
  //     nodes: { inputPath: string; children: { inputPath?: string }[] }[];
  //   };
  // }>(graphql`
  //   query LayoutQuery {
  //     site {
  //       siteMetadata {
  //         title
  //         keywords
  //         description
  //       }
  //     }
  //     allLonaDocumentPage {
  //       nodes {
  //         inputPath
  //         children {
  //           ... on LonaDocumentPage {
  //             inputPath
  //           }
  //         }
  //       }
  //     }
  //   }
  // `);
  const files = cleanupFiles(
    allLonaDocumentPage.nodes.map(x => ({
      ...x,
      children: x.children.filter(hasInputPath)
    }))
  );
  return (
    <Page>
      <GlobalStyles />
      <SkipLink href="#MainContent">Skip to main content</SkipLink>
      <Helmet
        title={site.siteMetadata.title}
        meta={[
          {
            name: "description",
            content: site.siteMetadata.title
          },
          {
            name: "keywords",
            content: site.siteMetadata.keywords.join(", ")
          },
          {
            name: "description",
            content: site.siteMetadata.description
          }
        ]}
      />
      <Header />
      <Content>
        <Sidebar files={files} location={location} />
        <Section>{children}</Section>
      </Content>
    </Page>
  );
};

export default Layout;
