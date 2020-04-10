import { CreatePagesArgs } from "gatsby";
import path from "path";

export async function createPages(
  { actions, graphql, getNodeAndSavePathDependency }: CreatePagesArgs,
  pluginOptions?: {
    workspacePath?: string;
    version?: string;
    baseURL?: string;
    githubRepo?: string;
  }
) {
  const { createPage } = actions;

  const baseURL = pluginOptions?.baseURL || process.env.GATSBY_BASE_URL;
  const githubRepo =
    pluginOptions?.githubRepo || process.env.GATSBY_GITHUB_REPOSITORY;

  createPage({
    path: "lona-design-artifacts",
    component: path.join(
      __dirname,
      "../src/templates/lona-design-artifacts.tsx"
    ),
    context: {
      baseURL,
      githubRepo
    }
  });

  const result = await graphql<{
    allLonaDocumentPage: {
      nodes: {
        id: string;
        inputPath: string;
        childMdx: { body: string };
      }[];
    };
  }>(`
    {
      allLonaDocumentPage {
        nodes {
          id
          inputPath
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

  const { allLonaDocumentPage } = result.data;

  allLonaDocumentPage.nodes.forEach(n => {
    const pagePath = `/${n.inputPath
      .replace(/README\.md$/g, "")
      .replace(/\.md$/g, "")}`;

    createPage({
      path: pagePath,
      component: path.join(__dirname, "../src/templates/mdx.tsx"),
      context: {
        mdx: n.childMdx.body
      }
    });
    getNodeAndSavePathDependency(n.id, pagePath);
  });
}
