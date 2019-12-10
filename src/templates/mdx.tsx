import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from "../components/Layout";

export default function Template(props) {
  return (
    <Layout location={props.location}>
      <MDXRenderer>{props.pageContext.mdx}</MDXRenderer>
    </Layout>
  );
}
