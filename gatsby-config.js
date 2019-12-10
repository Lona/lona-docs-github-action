module.exports = {
  pathPrefix: process.env.GATSBY_PATH_PREFIX,
  plugins: [
    {
      resolve: `gatsby-theme-lona-docs`,
      options: {
        docsPath: process.env.GATSBY_DOCS_PATH
      }
    }
  ]
};
