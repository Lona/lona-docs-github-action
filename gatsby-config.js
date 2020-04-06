const { execSync } = require("child_process");
const path = require("path");

module.exports = {
  pathPrefix: process.env.GATSBY_PATH_PREFIX,
  siteMetadata: {
    title: `Design System`,
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-mdx",
    "gatsby-plugin-typescript",
  ],
};
