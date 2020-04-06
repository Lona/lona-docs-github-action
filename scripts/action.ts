import * as core from "@actions/core";
import * as fs from "fs-extra";
import * as path from "path";
import { exec } from "child_process";

async function run() {
  try {
    const pathPrefix = core.getInput("path_prefix") || "";
    const version = core.getInput("version") || "";
    const baseURL = core.getInput("base_url") || "";
    const outputFolder = path.join(
      process.cwd(),
      core.getInput("output_folder")
    );
    const workspace_path = path.join(
      process.cwd(),
      core.getInput("workspace_path") || ""
    );

    fs.mkdirSync(outputFolder, { recursive: true });

    await new Promise((resolve, reject) => {
      exec(
        "./node_modules/gatsby-cli/lib/index.js build --prefix-paths",
        {
          cwd: path.dirname(__dirname),
          env: {
            PATH: process.env.PATH,
            GATSBY_PATH_PREFIX: pathPrefix,
            GATSBY_WORKSPACE_PATH: workspace_path,
            GATSBY_VERSION: version,
            GATSBY_BASE_URL: baseURL,
            GATSBY_GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
          },
        },
        (error, stdout, stderr) => {
          core.debug(stdout);
          core.debug(stderr);
          if (!error) {
            resolve();
            return;
          } else {
            reject(error);
          }
        }
      );
    });

    await fs.copy(path.join(path.dirname(__dirname), "public"), outputFolder);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
