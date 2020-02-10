const { execSync } = require("child_process");
const path = require("path");

module.exports = themeOptions => {
  return {
    siteMetadata: {
      title: `Design System`
    },
    plugins: [
      "gatsby-plugin-react-helmet",
      "gatsby-plugin-styled-components",
      "gatsby-plugin-mdx"
    ]
  };
};
