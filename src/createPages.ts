import { CreatePagesArgs } from "gatsby";
import path from "path";
import { Config } from "@lona/compiler";

export async function createPages(
  { actions, graphql, getNodeAndSavePathDependency }: CreatePagesArgs,
  pluginOptions?: {
    workspacePath?: string;
    version?: string;
    baseURL?: string;
  }
) {
  const { createPage } = actions;

  const baseURL = pluginOptions?.baseURL || process.env.GATSBY_BASE_URL;

  createPage({
    path: "lona-design-artifacts",
    component: path.join(__dirname, "pages/lona-design-artifacts.js"),
    context: {
      baseURL
    }
  });

  const result = await graphql<{
    allLonaConfig: {
      nodes: { config: Config }[];
    };
    allLonaDocumentPage: {
      nodes: {
        id: string;
        inputPath: string;
        children: { inputPath?: string }[];
        childMdx: { body: string };
      }[];
    };
  }>(`
    {
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
          childMdx {
            body
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors[0];
  }

  if (!result.data) {
    return;
  }

  const { allLonaDocumentPage, allLonaConfig } = result.data;

  const config = allLonaConfig.nodes[0]?.config;

  const site = {
    siteMetadata: {
      title:
        config.workspaceName || config.workspacePath
          ? path.basename(config.workspacePath)
          : "" || `Design System`,
      icon: config.workspaceIcon || null,
      description: config.workspaceDescription || "",
      keywords: config.workspaceKeywords || ["Lona", "design system"]
    }
  };

  allLonaDocumentPage.nodes.forEach(n => {
    const pagePath = `/${n.inputPath
      .replace(/README\.md$/g, "")
      .replace(/\.md$/g, "")}`;

    createPage({
      path: pagePath,
      component: path.join(__dirname, "templates/mdx.js"),
      context: {
        mdx: n.childMdx.body,
        site,
        allLonaDocumentPage: {
          nodes: allLonaDocumentPage.nodes.map(x => ({
            inputPath: x.inputPath,
            children: x.children
          }))
        }
      }
    });
    getNodeAndSavePathDependency(n.id, pagePath);
  });
}
