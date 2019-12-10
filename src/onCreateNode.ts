import { CreateNodeArgs, Node } from "gatsby";
import fs from "fs";
import { createContentDigest } from "gatsby-core-utils";
import { ConvertedWorkspace, ConvertedFile } from "./flat-tokens";

export function onCreateNode({
  node,
  actions,
  createNodeId,
  reporter
}: CreateNodeArgs) {
  const { createNode, createParentChildLink } = actions;

  // We only care about lona node.
  if (
    node.sourceInstanceName !== "__lona-docs" ||
    typeof node.absolutePath !== "string"
  ) {
    return;
  }

  function makeNode(
    data: ConvertedWorkspace,
    obj: ConvertedFile,
    parent: Node
  ) {
    if (obj.contents.type !== "documentationPage") {
      return;
    }

    const lonaNode: Node = {
      id: createNodeId(`${node.id} >>> ${obj.inputPath}`),
      children: [],
      parent: node.id,
      inputPath: obj.inputPath,
      outputPath: obj.outputPath,
      internal: {
        contentDigest: createContentDigest(obj.contents.value.mdxString),
        content: obj.contents.value.mdxString,
        type: `LonaDocumentPage`,
        mediaType: "text/x-markdown",
        owner: ""
      }
    };

    createNode(lonaNode);
    createParentChildLink({ parent, child: lonaNode });

    obj.contents.value.children.forEach(inputPath => {
      const child = data.files.find(x => x.inputPath === inputPath);
      if (child) {
        makeNode(data, child, lonaNode);
      }
    });
  }

  try {
    const content = fs.readFileSync(node.absolutePath, "utf8");
    const data: ConvertedWorkspace = JSON.parse(content);

    const root = data.files.find(x => x.inputPath === "README.md");

    if (!root) {
      reporter.info(`Cannot find root file of the Lona workspace`);
      return;
    }

    makeNode(data, root, node);
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing Lona Docs ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
      ${err.message}`
    );
  }
}
