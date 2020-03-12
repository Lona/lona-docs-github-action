import React from "react";
import { Link, withPrefix } from "gatsby";
import styled from "styled-components";
import path from "path";

import { Colors, Spacings } from "./ui-constants";
import { isInternal } from "../utils/url";

// case .paragraph, .quote: return .light
// case .h6, .h5, .h4: return .regular
// case .h3: return .medium
// case .h2: return .semibold
// case .h1: return .bold

export const h1 = styled.h1`
  font-size: 42px;
  line-height: 1.75;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const h2 = styled.h2`
  font-size: 30px;
  line-height: 1.75;
  font-weight: 600;
  margin-bottom: 4px;

  ${h1} + & {
    margin-top: 24px;
  }
`;

export const h3 = styled.h3`
  font-size: 22px;
  line-height: 1.75;
  font-weight: 500;
  margin-bottom: 4px;
`;

export const h4 = styled.h4`
  font-size: 16px;
  line-height: 1.75;
  margin-bottom: ${Spacings.block};
`;

export const h5 = styled.h5`
  font-size: 16px;
  line-height: 1.75;
  margin-bottom: ${Spacings.block};
`;

export const h6 = styled.h6`
  font-size: 16px;
  line-height: 1.75;
  margin-bottom: ${Spacings.block};
`;

export const p = styled.p`
  font-size: 16px;
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 8px;

  ${h1} + &, ${h2} + &, ${h3} + & {
    margin-top: 4px;
  }
`;

export const thematicBreak = styled.hr``;

const LinkProxy = (props: {
  location: Location;
  href: string;
  className?: string;
}) => {
  const { location, href, ...rest } = props;

  // Use an anchor tag for external links
  if (!isInternal(href)) {
    return <a {...rest} href={href} />;
  }

  let newHref = href.replace(/\.md$/, "");

  // Convert relative to absolute path.
  // We make a path _without_ the prefix, since gatsby's Link adds it automatically.
  if (!path.isAbsolute(newHref)) {
    const relativePath = path.relative(withPrefix("/"), location.pathname);

    newHref = path.join("/", relativePath, newHref);
  }

  return <Link {...rest} to={newHref} />;
};

export const a = styled(LinkProxy)`
  ${props =>
    (props.className || "").split(" ").indexOf("page") !== -1
      ? `
display: block;
// background: ${Colors.blockBackground};
color: ${Colors.editableText};
// text-decoration: none;
// padding: 4px 8px;
margin-bottom: ${Spacings.block};
font-size: 16px;
line-height: 1.75;
font-weight: 500;
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
