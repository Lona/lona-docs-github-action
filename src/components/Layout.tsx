import React, { ReactNode } from "react";
import path from "path";
import { Config } from "@lona/compiler";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Section from "./Section";

import { buildFileTree, Tree } from "../utils/tree";
import { GlobalStyles } from "./globalStyles";

const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  > * {
    flex: 1 1 0%;
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
  location
}: {
  children: ReactNode;
  location: Location;
}) => {
  const { allLonaConfig, allLonaDocumentPage } = useStaticQuery<{
    allLonaConfig: {
      nodes: { config: Config }[];
    };
    allLonaDocumentPage: {
      nodes: {
        id: string;
        inputPath: string;
        children: { inputPath?: string }[];
      }[];
    };
  }>(graphql`
    query LayoutQuery {
      allLonaConfig {
        nodes {
          config {
            workspaceName
            workspacePath
            workspaceIcon
            workspaceDescription
            workspaceKeywords
          }
        }
      }
      allLonaDocumentPage {
        nodes {
          id
          inputPath
          children {
            ... on LonaDocumentPage {
              inputPath
            }
          }
        }
      }
    }
  `);

  const fileTree: Tree | null = buildFileTree(
    allLonaDocumentPage.nodes.map(x => ({
      ...x,
      children: x.children.filter(hasInputPath)
    }))
  );

  if (!fileTree) {
    return <div>Failed to find root Lona page.</div>;
  }

  const config = allLonaConfig.nodes[0]?.config;

  const { title, icon, description, keywords } = {
    title:
      config.workspaceName || config.workspacePath
        ? path.basename(config.workspacePath)
        : "" || `Design System`,
    icon: config.workspaceIcon || null,
    description: config.workspaceDescription || "",
    keywords: config.workspaceKeywords || ["Lona", "design system"]
  };

  return (
    <Page>
      <GlobalStyles />
      <SkipLink href="#MainContent">Skip to main content</SkipLink>
      <Helmet
        title={title}
        meta={[
          {
            name: "description",
            content: description || title
          },
          {
            name: "keywords",
            content: keywords.join(", ")
          }
        ]}
        link={icon ? [{ rel: "icon", type: "image/png", href: icon }] : []}
      />
      <Content>
        <Sidebar
          title={title}
          iconUrl={icon}
          fileTree={fileTree}
          location={location}
        />
        <Section>{children}</Section>
      </Content>
    </Page>
  );
};

export default Layout;
