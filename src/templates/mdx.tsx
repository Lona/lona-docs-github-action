import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import Layout from "../components/Layout";
import * as components from "../components/Mdx-Components";

export default function Template(props: {
  location: Location;
  pageContext: {
    mdx: string;
    site: {
      siteMetadata: { title: string; keywords: string[]; description: string };
    };
    allLonaDocumentPage: {
      nodes: { inputPath: string; children: { inputPath?: string }[] }[];
    };
  };
}) {
  return (
    <Layout
      location={props.location}
      site={props.pageContext.site}
      allLonaDocumentPage={props.pageContext.allLonaDocumentPage}
    >
      <MDXProvider components={components}>
        <MDXRenderer>{props.pageContext.mdx}</MDXRenderer>
      </MDXProvider>
    </Layout>
  );
}
