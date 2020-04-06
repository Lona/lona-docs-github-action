import React from "react";
import { withPrefix } from "gatsby";
import styled from "styled-components";

import Layout from "../components/Layout";
import * as Components from "../components/Mdx-Components";

const Steps = styled.ol`
  list-style: decimal;
  padding-left: 25px;
`;

export default (props: {
  location: Location;
  pageContext: {
    baseURL: string;
    githubRepo: string;
  };
}) => {
  const { location, pageContext } = props;

  const [owner, repo] = (pageContext.githubRepo || "/").split("/");

  return (
    <Layout location={location}>
      <div>
        <Components.h1>Design System Artifacts</Components.h1>

        <Components.h2>Design Artifacts</Components.h2>
        <Components.h3>Sketch</Components.h3>
        <Components.p>
          Add the Sketch library:{" "}
          <a
            href={`sketch://add-library?url=${encodeURIComponent(
              `${pageContext.baseURL}${withPrefix("/sketch-library.xml")}`
            )}`}
          >
            Add Library
          </a>
        </Components.p>
        <Components.h3>Figma</Components.h3>
        <Components.p>Coming soon</Components.p>

        <Components.h2>Code Libraries</Components.h2>
        <Components.h3>React</Components.h3>
        <Components.p>
          You can install the{" "}
          <Components.a
            location={location}
            href={`https://github.com${pageContext.githubRepo}`}
          >
            package
          </Components.a>{" "}
          from GitHub Packages by:
          <Steps>
            <li>
              Authenticating to GitHub Packages. For more information, see{" "}
              <Components.a
                location={location}
                href="https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages"
              >
                "Authenticating to GitHub Packages."
              </Components.a>
            </li>
            <li>
              In the same directory as your{" "}
              <Components.inlineCode>package.json</Components.inlineCode> file,
              creating or editing an{" "}
              <Components.inlineCode>.npmrc</Components.inlineCode> file to
              include a line specifying GitHub Packages URL and the account
              owner.
              <pre>
                <Components.code>
                  registry=https://npm.pkg.github.com/{owner}
                </Components.code>
              </pre>
            </li>
            <li>
              Add the package as a dependency to your{" "}
              <Components.inlineCode>package.json</Components.inlineCode> file.
              <pre>
                <Components.code>
                  npm install @{owner}/{repo.toLowerCase()}
                </Components.code>
              </pre>
            </li>
          </Steps>
        </Components.p>
        <Components.h3>CocoaPods</Components.h3>
        <Components.p>Coming soon</Components.p>
      </div>
    </Layout>
  );
};
