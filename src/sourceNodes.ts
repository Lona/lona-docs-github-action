import { SourceNodesArgs, Node } from "gatsby";
import chokidar from "chokidar";
import fs from "fs";
import { execSync } from "child_process";
import { createContentDigest } from "gatsby-core-utils";
import { ConvertedWorkspace, ConvertedFile } from "lonac/types";

const lonac = require.resolve("lonac");

// TODO: create types

export function sourceNodes(
  { actions, createNodeId, reporter, getNode }: SourceNodesArgs,
  pluginOptions?: { workspacePath?: string; ignore?: string[] }
) {
  const { createNode, deleteNode, createParentChildLink } = actions;

  const workspacePath =
    (pluginOptions && pluginOptions.workspacePath) ||
    process.env.GATSBY_WORKSPACE_PATH;

  // Validate that the path exists.
  if (!fs.existsSync(workspacePath)) {
    reporter.panic(`
The path passed to gatsby-lona-docs-theme does not exist on your file system:
${workspacePath}
Please pick a path to an existing directory.
See docs here - https://github.com/Lona/lona-docs-github-action
      `);
  }

  function createId(inputPath: string) {
    return createNodeId(`lona_workspace >>> ${inputPath}`);
  }

  function createNodesForWorkspace() {
    try {
      const content = execSync(
        `node ${lonac} documentation --workspace ${workspacePath}`,
        { encoding: "utf8", stdio: ["inherit", "pipe", "pipe"] }
      );
      const data: ConvertedWorkspace = JSON.parse(content);

      const root = data.files.find(x => x.inputPath === "README.md");

      if (!root) {
        reporter.info(`Cannot find root file of the Lona workspace`);
        return;
      }

      makeNode(data, root);
    } catch (err) {
      reporter.panicOnBuild(
        `Error processing Lona Docs:\n
        ${err.message}`
      );
    }
  }

  const deletePathNode = (inputPath: string) => {
    const node = getNode(createId(inputPath));
    // It's possible the node was never created as sometimes tools will
    // write and then immediately delete temporary files to the file system.
    if (node) {
      deleteNode({ node });
    }
  };

  function makeNode(
    data: ConvertedWorkspace,
    obj: ConvertedFile,
    parent?: Node
  ) {
    if (obj.contents.type !== "documentationPage") {
      return;
    }

    const id = createId(obj.inputPath);

    createNode({
      id,
      children: [],
      inputPath: obj.inputPath,
      outputPath: obj.outputPath,
      internal: {
        contentDigest: createContentDigest(obj.contents.value.mdxString),
        content: obj.contents.value.mdxString,
        type: `LonaDocumentPage`,
        mediaType: "text/x-markdown"
      }
    });

    const lonaNode = getNode(id) as Node;

    if (parent) {
      createParentChildLink({ parent, child: lonaNode });
    }

    obj.contents.value.children.forEach(inputPath => {
      const child = data.files.find(x => x.inputPath === inputPath);
      if (child) {
        makeNode(data, child, lonaNode);
      }
    });
  }

  const watcher = chokidar.watch(workspacePath, {
    ignored: [
      `**/*.un~`,
      `**/.DS_Store`,
      `**/.gitignore`,
      `**/.npmignore`,
      `**/.babelrc`,
      `**/yarn.lock`,
      `**/bower_components`,
      `**/node_modules`,
      `../**/dist/**`,
      ...((pluginOptions || {}).ignore || [])
    ],
    ignoreInitial: true
  });

  watcher.on(`add`, () => {
    createNodesForWorkspace();
  });

  watcher.on(`change`, () => {
    createNodesForWorkspace();
  });

  watcher.on(`unlink`, path => {
    deletePathNode(path);
    createNodesForWorkspace();
  });

  return new Promise(resolve => {
    watcher.on(`ready`, () => {
      createNodesForWorkspace();
      resolve();
    });
  });
}
