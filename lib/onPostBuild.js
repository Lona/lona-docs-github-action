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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rfc822_date_1 = __importDefault(require("rfc822-date"));
const sketchLibRSSOutputPath = `./public/sketch-library.xml`;
/**
 * Output the flat-tokens file
 */
function onPostBuild({ reporter, graphql, pathPrefix }, pluginOptions) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const workspacePath = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.workspacePath) || process.env.GATSBY_WORKSPACE_PATH;
        const version = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.version) || process.env.GATSBY_VERSION;
        const baseURL = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.baseURL) || process.env.GATSBY_BASE_URL;
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
        const result = yield graphql(`
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
    }
  `);
        if (result.errors) {
            throw result.errors[0];
        }
        if (!result.data) {
            return;
        }
        const { allLonaConfig } = result.data;
        const config = (_a = allLonaConfig.nodes[0]) === null || _a === void 0 ? void 0 : _a.config;
        const title = config.workspaceName || config.workspacePath
            ? path_1.default.basename(config.workspacePath)
            : "" || `Design System`;
        fs_1.default.writeFileSync(sketchLibRSSOutputPath, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>${title}</title>
    <description>${title}</description>
    <image>
      <url></url>
      <title>${title}</title>
    </image>
    <generator>Lona</generator>
    <item>
      <title>${title}</title>
      <pubDate>${rfc822_date_1.default(new Date())}</pubDate>
      <enclosure url="${baseURL}${pathPrefix}/library.sketch" type="application/octet-stream" sparkle:version="${version}"/>
    </item>
  </channel>
</rss>`);
    });
}
exports.onPostBuild = onPostBuild;
