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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathPrefix = core.getInput("path_prefix") || "";
            const version = core.getInput("version") || "";
            const baseURL = core.getInput("base_url") || "";
            const outputFolder = path.join(process.cwd(), core.getInput("output_folder"));
            const workspace_path = path.join(process.cwd(), core.getInput("workspace_path") || "");
            fs.mkdirSync(outputFolder, { recursive: true });
            yield new Promise((resolve, reject) => {
                child_process_1.exec("./node_modules/gatsby-cli/lib/index.js build --prefix-paths", {
                    cwd: path.dirname(__dirname),
                    env: {
                        PATH: process.env.PATH,
                        GATSBY_PATH_PREFIX: pathPrefix,
                        GATSBY_WORKSPACE_PATH: workspace_path,
                        GATSBY_VERSION: version,
                        GATSBY_BASE_URL: baseURL,
                        GATSBY_GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY
                    }
                }, (error, stdout, stderr) => {
                    core.debug(stdout);
                    core.debug(stderr);
                    if (!error) {
                        resolve();
                        return;
                    }
                    else {
                        reject(error);
                    }
                });
            });
            yield fs.copy(path.join(path.dirname(__dirname), "public"), outputFolder);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
