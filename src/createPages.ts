import { CreatePagesArgs } from "gatsby";
import path from "path";

export function createPages({
  actions,
  graphql,
  getNodeAndSavePathDependency
}: CreatePagesArgs) {
  const { createPage } = actions;

  return graphql<{
    site: {
      siteMetadata: { title: string; keywords: string[]; description: string };
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
      site {
        siteMetadata {
          title
          keywords
          description
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
  `).then(result => {
    if (result.errors) {
      throw result.errors[0];
    }

    if (!result.data) {
      return;
    }

    const { allLonaDocumentPage, site } = result.data;

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
  });
}
