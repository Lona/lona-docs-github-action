import { CSSObject } from "styled-components";
import * as colors from "./colors";

// https://type-scale.com/
// Base size: 16px
// Scale: 1.25
const typeScale = [48, 39, 31, 25, 20, 16, 12, 10, 8];

export const heading1: CSSObject = {
  fontSize: typeScale[0],
  lineHeight: 1.75,
  fontWeight: 700,
  color: colors.text
};

export const heading2: CSSObject = {
  fontSize: typeScale[2],
  lineHeight: 1.75,
  fontWeight: 700,
  color: colors.text
};

export const heading3: CSSObject = {
  fontSize: typeScale[4],
  lineHeight: 1.75,
  fontWeight: 700,
  color: colors.text
};

export const regular = {
  fontSize: typeScale[5],
  lineHeight: 1.75,
  fontWeight: 400,
  color: colors.text
  // letterSpacing: 0.1
};

export const small = {
  fontSize: typeScale[6],
  lineHeight: 1.75,
  fontWeight: 500,
  color: colors.text
};

export const regularBold = {
  ...regular,
  fontWeight: 600
};
