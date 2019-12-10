module.exports = themeOptions => ({
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
        path: themeOptions.docsPath
      }
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-mdx"
  ]
});
