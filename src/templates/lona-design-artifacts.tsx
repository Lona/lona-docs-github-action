import React, { useState } from "react";
import { withPrefix } from "gatsby";
import styled from "styled-components";

import Layout from "../components/Layout";
import * as Components from "../components/Mdx-Components";
import { Link } from "../components/Button";
import { Select } from "../components/Select";

const Steps = styled.ol`
  list-style: decimal;
  padding-left: 25px;
`;

const SvgWrapper = styled.svg`
  display: inline;
`;

const SketchIcon = () => (
  <SvgWrapper
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14.5"
    viewBox="0 0 394 356"
  >
    <g fillRule="nonzero" fill="none">
      <path
        fill="#FDB300"
        d="M85.79 11.715L196.603 0l110.812 11.715 85.79 115.166-196.602 228.942L0 126.881z"
      />
      <path fill="#EA6C00" d="M79.634 126.881l116.969 228.942L0 126.881z" />
      <path
        fill="#EA6C00"
        d="M313.571 126.881L196.602 355.823l196.603-228.942z"
      />
      <path fill="#FDAD00" d="M79.634 126.881h233.938L196.603 355.823z" />
      <g>
        <path fill="#FDD231" d="M196.603 0L85.79 11.715l-6.156 115.166z" />
        <path fill="#FDD231" d="M196.602 0l110.813 11.715 6.156 115.166z" />
        <path
          fill="#FDAD00"
          d="M393.206 126.881L307.415 11.715l6.157 115.166zM0 126.881L85.79 11.715l-6.156 115.166z"
        />
        <path fill="#FEEEB7" d="M196.603 0L79.634 126.881h233.938z" />
      </g>
    </g>
  </SvgWrapper>
);

export default (props: {
  location: Location;
  pageContext: {
    baseURL: string;
    githubRepo: string;
  };
}) => {
  const { location, pageContext } = props;
  const [manager, setManager] = useState("Npm");

  const [owner, repo] = (pageContext.githubRepo || "/").split("/");

  return (
    <Layout location={location}>
      <div>
        <Components.h1>Design System Artifacts</Components.h1>

        <Components.h2>Design Artifacts</Components.h2>
        <Components.h3>Sketch</Components.h3>
        <Components.p>
          Add the Sketch library:{" "}
          <Components.p>
            <Link
              href={`sketch://add-library?url=${encodeURIComponent(
                `${pageContext.baseURL}${withPrefix("/sketch-library.xml")}`
              )}`}
            >
              <SketchIcon /> Add the Sketch Library
            </Link>
          </Components.p>
        </Components.p>
        <Components.h3>Figma</Components.h3>
        <Components.p>Coming soon</Components.p>

        <Components.h2>Code Libraries</Components.h2>
        <Select
          value={manager}
          onChange={e => setManager(e.target.value)}
          style={{ float: "right" }}
        >
          <option>Npm</option>
          <option>Yarn</option>
        </Select>
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
              <Components.inlineCode>
                {manager === "Yarn" ? ".yarnrc" : ".npmrc"}
              </Components.inlineCode>{" "}
              file to include a line specifying GitHub Packages URL and the
              account owner.
              <pre>
                <Components.code>
                  {manager === "Yarn"
                    ? `"@${owner.toLowerCase()}:registry" "https://npm.pkg.github.com"`
                    : `registry=https://npm.pkg.github.com/${owner.toLowerCase()}`}
                </Components.code>
              </pre>
            </li>
            <li>
              Add the package as a dependency to your{" "}
              <Components.inlineCode>package.json</Components.inlineCode> file.
              <pre>
                <Components.code>
                  {manager === "Yarn" ? `yarn add` : `npm install`} @
                  {owner.toLowerCase()}/{repo.toLowerCase()}
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
