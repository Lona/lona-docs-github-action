import { SourceNodesArgs, Node, CreateSchemaCustomizationArgs } from "gatsby";
import chokidar from "chokidar";
import fs from "fs";
import { createContentDigest } from "gatsby-core-utils";
import * as lona from "@lona/compiler";
import {
  ConvertedWorkspace,
  ConvertedFile
} from "@lona/compiler/lib/plugins/documentation";

export function createSchemaCustomization({
  actions
}: CreateSchemaCustomizationArgs) {
  const { createTypes } = actions;

  const typeDefs = `
    type LonaConfig implements Node @dontInfer {
      config: LonaConfigFields
    }
    type LonaConfigFields {
      workspaceName: String
      workspacePath: String!
      workspaceIcon: String
      workspaceDescription: String
      workspaceKeywords: [String!]
    }
  `;
  createTypes(typeDefs);
}

export function sourceNodes(
  { actions, createNodeId, reporter, getNode }: SourceNodesArgs,
  pluginOptions?: { workspacePath?: string; ignore?: string[] }
) {
  const { createNode, deleteNode, createParentChildLink } = actions;

  const workspacePath =
    pluginOptions?.workspacePath || process.env.GATSBY_WORKSPACE_PATH;

  // Validate that the path exists.
  if (!workspacePath || !fs.existsSync(workspacePath)) {
    reporter.panic(`
The path passed to gatsby-lona-docs-theme does not exist on your file system:
${workspacePath}
Please pick a path to an existing directory.
See docs here - https://github.com/Lona/lona-docs-github-action
      `);
    return;
  }

  function createId(inputPath: string) {
    return createNodeId(`lona_workspace >>> ${inputPath}`);
  }

  async function createNodesForWorkspace() {
    if (!workspacePath) {
      return;
    }
    try {
      const config = await lona.getConfig(workspacePath);

      const id = createId(`${workspacePath}_config`);

      createNode({
        id,
        children: [],
        config: config,
        internal: {
          contentDigest: createContentDigest(JSON.stringify(config)),
          content: JSON.stringify(config),
          type: `LonaConfig`,
          mediaType: "application/json"
        }
      });

      const content: ConvertedWorkspace = await lona.convert(
        workspacePath,
        "documentation"
      );

      const root = content.files.find(x => x.inputPath === "README.md");

      if (!root) {
        reporter.info(`Cannot find root file of the Lona workspace`);
        return;
      }

      makeNode(content, root);
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
      const resolvedInputPath = `${obj.inputPath.replace(
        /README.md$/g,
        ""
      )}${inputPath}`;
      const child = data.files.find(
        x =>
          x.inputPath === resolvedInputPath ||
          x.inputPath === `${resolvedInputPath}/README.md`
      );
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
      createNodesForWorkspace().then(resolve);
    });
  });
}
