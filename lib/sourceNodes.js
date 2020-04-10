"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const gatsby_core_utils_1 = require("gatsby-core-utils");
const lona = __importStar(require("@lona/compiler"));
const tokensOutputPath = `./public/flat-tokens.json`;
function createSchemaCustomization({ actions }) {
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

    type LonaToken implements Node @dontInfer {
      token: LonaTokenFields
    }
    type LonaTokenFields {
      value: LonaTokenValue!
      qualifiedName: [String!]!
    }
    type LonaTokenValue {
      value: String
      type: String!
    }
    type LonaTokenValueValue {
      css: String
      fontName: String
      fontFamily: String
      fontWeight: String
      fontSize: Float
      lineHeight: Float
      letterSpacing: Float
      color: LonaColorValue
      x: Float
      y: Float
      blur: Float
      radius: Float
    }
    type LonaColorValue {
      css: String
    }
  `;
    createTypes(typeDefs);
}
exports.createSchemaCustomization = createSchemaCustomization;
function sourceNodes({ actions, createNodeId, reporter, getNode }, pluginOptions) {
    const { createNode, deleteNode, createParentChildLink } = actions;
    const workspacePath = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.workspacePath) || process.env.GATSBY_WORKSPACE_PATH;
    // Validate that the path exists.
    if (!workspacePath || !fs_1.default.existsSync(workspacePath)) {
        reporter.panic(`
The path passed to gatsby-lona-docs-theme does not exist on your file system:
${workspacePath}
Please pick a path to an existing directory.
See docs here - https://github.com/Lona/lona-docs-github-action
      `);
        return;
    }
    function createId(inputPath) {
        return createNodeId(`lona_workspace >>> ${inputPath}`);
    }
    function createNodesForWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!workspacePath) {
                return;
            }
            try {
                const config = yield lona.getConfig(workspacePath);
                createNode({
                    id: createId(`${workspacePath}_config`),
                    children: [],
                    config: config,
                    internal: {
                        contentDigest: gatsby_core_utils_1.createContentDigest(JSON.stringify(config)),
                        content: JSON.stringify(config),
                        type: `LonaConfig`,
                        mediaType: "application/json"
                    }
                });
                const tokens = yield lona.convert(workspacePath, "tokens");
                tokens.files.forEach(f => {
                    f.contents.value.forEach(token => {
                        createNode({
                            id: createId(`${workspacePath}_token_${token.qualifiedName.join(".")}`),
                            children: [],
                            token: token,
                            internal: {
                                contentDigest: gatsby_core_utils_1.createContentDigest(JSON.stringify(token)),
                                content: JSON.stringify(token),
                                type: `LonaToken`,
                                mediaType: "application/json"
                            }
                        });
                    });
                });
                const outputDir = path_1.default.dirname(tokensOutputPath);
                if (!fs_1.default.existsSync(outputDir)) {
                    fs_1.default.mkdirSync(outputDir, { recursive: true });
                }
                fs_1.default.writeFileSync(tokensOutputPath, JSON.stringify(tokens, null, "  "));
                const content = yield lona.convert(workspacePath, "documentation");
                const root = content.files.find(x => x.inputPath === "README.md");
                if (!root) {
                    reporter.info(`Cannot find root file of the Lona workspace`);
                    return;
                }
                makeNode(content, root);
            }
            catch (err) {
                reporter.panicOnBuild(`Error processing Lona Docs:\n
        ${err.message}`);
            }
        });
    }
    const deletePathNode = (inputPath) => {
        const node = getNode(createId(inputPath));
        // It's possible the node was never created as sometimes tools will
        // write and then immediately delete temporary files to the file system.
        if (node) {
            deleteNode({ node });
        }
    };
    function makeNode(data, obj, parent) {
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
                contentDigest: gatsby_core_utils_1.createContentDigest(obj.contents.value.mdxString),
                content: obj.contents.value.mdxString,
                type: `LonaDocumentPage`,
                mediaType: "text/x-markdown"
            }
        });
        const lonaNode = getNode(id);
        if (parent) {
            createParentChildLink({ parent, child: lonaNode });
        }
        obj.contents.value.children.forEach(inputPath => {
            const resolvedInputPath = `${obj.inputPath.replace(/README.md$/g, "")}${inputPath}`;
            const child = data.files.find(x => x.inputPath === resolvedInputPath ||
                x.inputPath === `${resolvedInputPath}/README.md`);
            if (child) {
                makeNode(data, child, lonaNode);
            }
        });
    }
    const watcher = chokidar_1.default.watch(workspacePath, {
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
exports.sourceNodes = sourceNodes;
