import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";

import { Colors, Spacings } from "./ui-constants";

export const p = styled.p`
  color: black;
  margin-bottom: ${Spacings.block};
`;
export const h1 = styled.h1`
  margin-bottom: ${Spacings.block};
`;
export const h2 = styled.h2`
  margin-bottom: ${Spacings.block};
`;
export const h3 = styled.h3`
  margin-bottom: ${Spacings.block};
`;
export const h4 = styled.h4`
  margin-bottom: ${Spacings.block};
`;
export const h5 = styled.h5`
  margin-bottom: ${Spacings.block};
`;
export const h6 = styled.h6`
  margin-bottom: ${Spacings.block};
`;
export const thematicBreak = styled.hr``;

const LinkProxy = (props: { href: string; className?: string }) => {
  const internal = /^(\/(?!\/)|\w|\.+\/)/.test(props.href);

  // external link so use a
  if (!internal) {
    return <a {...props} />;
  }

  let newHref = props.href.replace(/\.md$/, "");

  if (newHref.indexOf("/") !== 0) {
    // this is a relative link from the current page

    let root = "/";
    if (typeof window !== "undefined") {
      // TODO: make this work with SSR (maybe passing the location in a Context?)
      const prefix = withPrefix("/");
      root = window.location.pathname.replace(prefix, "/");
      if (root !== "/") {
        root += "/";
      }
    }
    newHref = `${root}${newHref}`;
  }

  return <Link {...props} to={newHref} />;
};

export const a = styled(LinkProxy)`
  ${props =>
    (props.className || "").split(" ").indexOf("page") !== -1
      ? `
display: block;
background: ${Colors.blockBackground};
color: ${Colors.editableText};
text-decoration: none;
padding: 8px;
margin-bottom: ${Spacings.block};
`
      : ""}
`;

const TokenWrapper = styled.div`
  padding: 4px 12px;
  display: flex;
  flex-direction: row;
  height: 80px;
  background: ${Colors.blockBackground};
  margin-bottom: ${Spacings.block};
  align-items: center;
`;

const UnknownTokenPreview = styled.div``;
const TokenPreview = styled(UnknownTokenPreview)<{
  type: "textStyle" | "shadow" | "color";
  "data-color"?: string;
}>`
  ${props =>
    props.type === "color"
      ? `
  width: 32px;
  height: 32px;
  background: ${props["data-color"]};
  margin-right: 8px;
`
      : ""}
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;

  .lona-token-name {
    font-size: 13px;
  }

  .lona-token-value {
    font-size: 10px;
    color: ${Colors.textMuted};
  }
`;

export const div = (props: { className?: string }) => {
  const { className } = props;

  if (!className) {
    return <div {...props} />;
  }

  const classNames = className.split(" ");

  if (classNames.indexOf("lona-token") !== -1) {
    return <TokenWrapper {...props} />;
  }

  if (classNames.indexOf("lona-token-preview") !== -1) {
    const type = classNames[1].replace("lona-token-preview-", "");

    if (type !== "color" && type !== "textStyle" && type !== "shadow") {
      return <UnknownTokenPreview {...props} />;
    }
    return <TokenPreview {...props} type={type} />;
  }

  if (classNames.indexOf("lona-token-details") !== -1) {
    return <TokenDetails {...props} />;
  }

  console.log(classNames, props);

  return <div {...props} />;
};
