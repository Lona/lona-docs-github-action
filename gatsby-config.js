module.exports = {
  pathPrefix: process.env.GATSBY_PATH_PREFIX,
  siteMetadata: {
    title: `Design System`,
    description: ``,
    keywords: ["Lona", "design system"]
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "__lona-docs",
        path: process.env.GATSBY_DOCS_PATH
      }
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-mdx"
  ]
};
