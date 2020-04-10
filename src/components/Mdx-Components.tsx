import React from "react";
import { Link, withPrefix } from "gatsby";
import styled, { StyledComponent, css } from "styled-components";
import path from "path";

import { isInternal } from "../utils/url";
import { colors, textStyles } from "../foundation";

export const code = styled.pre`
  background-color: ${colors.divider};
  padding: 10px;
`;

export const inlineCode = styled.code`
  background-color: ${colors.divider};
  padding: 1px 3px;
`;

export const h1: StyledComponent<"h1", {}> = styled.h1`
  ${textStyles.heading1}
  margin-bottom: 8px;
`;

export const h2 = styled.h2`
  ${textStyles.heading2}
  margin-bottom: 8px;

  ${h1} + & {
    margin-top: 24px;
  }
`;

export const h3 = styled.h3`
  ${textStyles.heading3}
  margin-bottom: 8px;

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
  }
`;

export const thematicBreak = styled.hr``;

export const a = (props: {
  location: Location;
  href: string;
  className?: string;
  children?: React.ReactChildren | string;
}) => {
  const { location, href = "", ...rest } = props;

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

const TokenBlock = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: row;
  background: ${colors.blockBackground};
  margin-bottom: 8px;

  ${headingMargins};
`;

const tokenPreviewStyles = `
  width: 60px;
  height: 60px;
  margin-right: 8px;
  border-radius: 4px;
  border: 1px solid ${colors.divider};

  background: ${colors.contentBackground};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ColorTokenPreview = styled.div`
  ${tokenPreviewStyles};
`;

const ShadowTokenPreview = styled.div`
  ${tokenPreviewStyles};
`;

const ShadowTokenPreviewBoxDiagram = styled.div`
  width: 24px;
  height: 24px;
  background: ${colors.contentBackground};
`;

const TextStyleTokenPreview = styled.div`
  ${tokenPreviewStyles};
  width: 120px;
`;

const UnknownTokenPreview = styled.div``;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;

  .lona-token-name {
    ${textStyles.small};
    font-weight: 700;
  }

  .lona-token-value {
    ${textStyles.small};
    color: ${colors.textMuted};
  }
`;

export const div = (props: {
  className?: string;
  "data-color"?: string;
  "data-fontFamily"?: string;
  "data-fontWeight"?: string;
  "data-fontSize"?: string;
  "data-letterSpacing"?: string;
  "data-lineHeight"?: string;
  "data-x"?: string;
  "data-y"?: string;
  "data-blur"?: string;
  "data-radius"?: string;
}) => {
  const { className } = props;

  if (!className) {
    return <div {...props} />;
  }

  const classNames = className.split(" ");

  if (classNames.includes("lona-token")) {
    return <TokenBlock {...props} />;
  }

  if (classNames.includes("lona-token-preview")) {
    const type = classNames[1].replace("lona-token-preview-", "");

    switch (type) {
      case "color": {
        const { "data-color": color, ...rest } = props;

        return (
          <ColorTokenPreview
            style={{
              backgroundColor: color
            }}
            {...props}
          />
        );
      }
      case "textStyle": {
        const {
          "data-fontFamily": fontFamily,
          "data-fontWeight": fontWeight,
          "data-fontSize": fontSize,
          "data-color": color,
          "data-letterSpacing": letterSpacing,
          "data-lineHeight": lineHeight,
          ...rest
        } = props;

        return (
          <TextStyleTokenPreview
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight ? parseInt(fontWeight) : 400,
              letterSpacing,
              lineHeight,
              color
            }}
            {...rest}
          >
            Style
          </TextStyleTokenPreview>
        );
      }
      case "shadow":
      case "textStyle": {
        const {
          "data-x": x = 0,
          "data-y": y = 0,
          "data-blur": blur = 0,
          "data-radius": radius = 0,
          "data-color": color = "black",
          ...rest
        } = props;

        return (
          <ShadowTokenPreview {...rest}>
            <ShadowTokenPreviewBoxDiagram
              style={{
                boxShadow: `${x}px ${y}px ${blur}px ${radius}px ${color}`
              }}
            />
          </ShadowTokenPreview>
        );
      }
      default:
        return <UnknownTokenPreview {...props} />;
    }
  }

  if (classNames.includes("lona-token-details")) {
    return <TokenDetails {...props} />;
  }

  return <div {...props} />;
};
