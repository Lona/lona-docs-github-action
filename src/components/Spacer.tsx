import React from "react";

export default function Spacer({
  size,
  horizontal
}: {
  size: number;
  horizontal: boolean;
}) {
  const style: { width?: string; height?: string; flex?: string } = {};

  if (horizontal) {
    style.width = `${size}px`;
    style.flex = `0 0 ${size}px`;
  } else {
    style.height = `${size}px`;
    style.flex = `0 0 ${size}px`;
  }

  return <div style={style} />;
}
