import { CreatePagesArgs } from "gatsby";
import path from "path";

export function createPages({ actions, graphql }: CreatePagesArgs) {
  const { createPage } = actions;

  return graphql<{
    allLonaDocumentPage: {
      nodes: {
        inputPath: string;
        id: string;
        children: { inputPath: string }[];
        childMdx: { body: string };
      }[];
    };
  }>(`
    {
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

    result.data.allLonaDocumentPage.nodes.forEach(n => {
      createPage({
        path: `/${n.inputPath
          .replace(/README\.md$/g, "")
          .replace(/\.md$/g, "")}`,
        component: path.join(__dirname, "templates/mdx.js"),
        context: {
          mdx: n.childMdx.body
        }
      });
    });
  });
}
