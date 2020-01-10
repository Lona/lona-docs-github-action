const { execSync } = require("child_process");
const path = require("path");

const lonac = require.resolve("lonac");

module.exports = themeOptions => {
  const content = execSync(
    `node ${lonac} config --workspace ${(pluginOptions &&
      pluginOptions.workspacePath) ||
      ""}`,
    {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"]
    }
  );

  const config = JSON.parse(content);

  return {
    siteMetadata: {
      title:
        config.workspaceName ||
        path.basename((pluginOptions && pluginOptions.workspacePath) || "") ||
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
};
