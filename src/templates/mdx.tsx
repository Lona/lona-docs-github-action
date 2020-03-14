import React, { useMemo } from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import Layout from "../components/Layout";
import * as components from "../components/Mdx-Components";

export default function Template(props: {
  location: Location;
  pageContext: {
    mdx: string;
    site: {
      siteMetadata: {
        title: string;
        keywords: string[];
        description: string;
        icon: string | null;
      };
    };
    allLonaDocumentPage: {
      nodes: { inputPath: string; children: { inputPath?: string }[] }[];
    };
  };
}) {
  const { location, pageContext } = props;

  const componentsWithLocation = useMemo(
    () => ({
      ...components,
      a: (props: { href: string; className?: string }) => (
        <components.a location={location} {...props} />
      )
    }),
    [location.href]
  );

  return (
    <Layout
      location={location}
      site={pageContext.site}
      allLonaDocumentPage={pageContext.allLonaDocumentPage}
    >
      <MDXProvider components={componentsWithLocation}>
        <MDXRenderer>{pageContext.mdx}</MDXRenderer>
      </MDXProvider>
    </Layout>
  );
}
