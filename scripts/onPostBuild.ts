import path from "path";
import { BuildArgs } from "gatsby";
import fs from "fs";
import convertDate from "rfc822-date";
const sketchLibRSSOutputPath = `./public/sketch-library.xml`;

/**
 * Output the flat-tokens file
 */
export async function onPostBuild(
  { reporter, graphql, pathPrefix }: BuildArgs,
  pluginOptions?: {
    workspacePath?: string;
    version?: string;
    baseURL?: string;
  }
) {
  const workspacePath =
    pluginOptions?.workspacePath || process.env.GATSBY_WORKSPACE_PATH;
  const version = pluginOptions?.version || process.env.GATSBY_VERSION;
  const baseURL = pluginOptions?.baseURL || process.env.GATSBY_BASE_URL;

  // Validate that the path exists.
  if (!workspacePath || !fs.existsSync(workspacePath)) {
    reporter.panic(`
The path passed to gatsby-lona-docs-theme does not exist on your file system:
${workspacePath}
Please pick a path to an existing directory.
See docs here - https://github.com/Lona/lona-docs-github-action
      `);
    return;
  }

  const result = await graphql(`
    {
      allLonaConfig {
        nodes {
          config {
            workspaceName
            workspacePath
            workspaceIcon
            workspaceDescription
            workspaceKeywords
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors[0];
  }

  if (!result.data) {
    return;
  }

  const { allLonaConfig } = result.data;

  const config = allLonaConfig.nodes[0]?.config;

  const title =
    config.workspaceName || config.workspacePath
      ? path.basename(config.workspacePath)
      : "" || `Design System`;

  fs.writeFileSync(
    sketchLibRSSOutputPath,
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>${title}</title>
    <description>${title}</description>
    <image>
      <url></url>
      <title>${title}</title>
    </image>
    <generator>Lona</generator>
    <item>
      <title>${title}</title>
      <pubDate>${convertDate(new Date())}</pubDate>
      <enclosure url="${baseURL}${pathPrefix}/library.sketch" type="application/octet-stream" sparkle:version="${version}"/>
    </item>
  </channel>
</rss>`
  );
}
