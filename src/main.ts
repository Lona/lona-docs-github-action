import * as core from "@actions/core";
import * as fs from "fs-extra";
import * as path from "path";
import { exec } from "child_process";

async function run() {
  try {
    const secretPrefix = core.getInput("secret_prefix");
    const outputFolder = path.join(
      process.cwd(),
      core.getInput("output_folder")
    );

    fs.mkdirSync(outputFolder, { recursive: true });

    await new Promise((resolve, reject) => {
      exec(
        "./node_modules/.bin/gatsby build",
        {
          cwd: path.dirname(__dirname),
          env: {
            GATSBY_PATH_PREFIX: secretPrefix,
            GATSBY_DOCS_PATH: path.join(outputFolder, "docs.json")
          }
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
