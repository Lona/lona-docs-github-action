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
function createPages({ actions, graphql, getNodeAndSavePathDependency }, pluginOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { createPage } = actions;
        const baseURL = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.baseURL) || process.env.GATSBY_BASE_URL;
        const githubRepo = (pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.githubRepo) || process.env.GATSBY_GITHUB_REPOSITORY;
        createPage({
            path: "lona-design-artifacts",
            component: path_1.default.join(__dirname, "../src/templates/lona-design-artifacts.tsx"),
            context: {
                baseURL,
                githubRepo
            }
        });
        const result = yield graphql(`
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
                component: path_1.default.join(__dirname, "../src/templates/mdx.tsx"),
                context: {
                    mdx: n.childMdx.body
                }
            });
            getNodeAndSavePathDependency(n.id, pagePath);
        });
    });
}
exports.createPages = createPages;
