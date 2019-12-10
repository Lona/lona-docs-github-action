import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../components/Layout";

export default function Template(props) {
  return (
    <Layout
      location={props.location}
      site={props.pageContext.site}
      allLonaDocumentPage={props.pageContext.allLonaDocumentPage}
    >
      <MDXRenderer>{props.pageContext.mdx}</MDXRenderer>
    </Layout>
  );
}
