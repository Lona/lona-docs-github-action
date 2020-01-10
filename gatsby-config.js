const { execSync } = require("child_process");
const path = require("path");

const lonac = require.resolve("lonac");

const content = execSync(
  `node ${lonac} config --workspace ${process.env.GATSBY_WORKSPACE_PATH}`,
  {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"]
  }
);

const config = JSON.parse(content);

module.exports = {
  pathPrefix: process.env.GATSBY_PATH_PREFIX,
  siteMetadata: {
    title:
      config.workspaceName ||
      path.basename(process.env.GATSBY_WORKSPACE_PATH || "") ||
      `Design System`,
    icon: config.workspaceIcon || null,
    description: config.workspaceDescription || "",
    keywords: config.worlspaceKeywords || ["Lona", "design system"]
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-mdx"
  ]
};
