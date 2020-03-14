import React from "react";
import { Link, withPrefix } from "gatsby";
import styled, { StyledComponent, css } from "styled-components";
import path from "path";

import { isInternal } from "../utils/url";
import { colors, textStyles, spacing } from "../foundation";

export const h1: StyledComponent<"h1", {}> = styled.h1`
  ${textStyles.heading1}
`;

export const h2 = styled.h2`
  ${textStyles.heading2}

  ${h1} + & {
    margin-top: 24px;
  }
`;

export const h3 = styled.h3`
  ${textStyles.heading3}

  ${h1} + &, ${h2} + & {
    margin-top: 24px;
  }
`;

const headingMargins = css`
  ${h1} + &, ${h2} + &, ${h3} + & {
    margin-top: 4px;
  }

  & + ${h1}, & + ${h2}, & + ${h3} {
    margin-top: 24px;
    margin-bottom: 8px;
  }
`;

export const p = styled.p`
  ${textStyles.regular}

  margin-bottom: 8px;

  ${headingMargins}
`;

const Anchor = styled.a`
  ${textStyles.regular}

  color: ${colors.editableText};
`;

const PageLink = styled(Link)`
  ${textStyles.regular};
  font-weight: 500;
  color: ${colors.editableText};
  background: ${colors.blockBackground};
  text-decoration: none;

  display: block;
  padding: 8px 12px;
  margin-bottom: 8px;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.85;
  }

  &::before {
    content: "→  ";
    white-space: pre;
  }

  & + ${h1}, & + ${h2}, & + ${h3} {
    margin-top: 30px;
    margin-bottom: 8px;
  }
`;

export const thematicBreak = styled.hr``;

export const a = (props: {
  location: Location;
  href: string;
  className?: string;
}) => {
  const { location, href, ...rest } = props;

  // Use an anchor tag for external links
  if (!isInternal(href)) {
    return <Anchor {...rest} href={href} />;
  }

  let newHref = href.replace(/\.md$/, "");

  // Convert relative to absolute path.
  // We make a path _without_ the prefix, since gatsby's Link adds it automatically.
  if (!path.isAbsolute(newHref)) {
    const relativePath = path.relative(withPrefix("/"), location.pathname);

    newHref = path.join("/", relativePath, newHref);
  }

  const isPage = (props.className || "").split(" ").includes("page");

  return isPage ? (
    <PageLink {...rest} to={newHref} />
  ) : (
    <Link {...rest} to={newHref} />
  );
};

const TokenWrapper = styled.div`
  padding: 4px 12px;
  display: flex;
  flex-direction: row;
  height: 80px;
  background: ${colors.blockBackground};
  margin-bottom: ${spacing.block}px;
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
    color: ${colors.textMuted};
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
