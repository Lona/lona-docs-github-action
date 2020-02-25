import React from "react";
import { withPrefix } from "gatsby";

export default () => {
  return (
    <div>
      <p>Download the figma plugin</p>
      <p>
        Add the Sketch library:{" "}
        <a
          href={`sketch://add-library?url=${encodeURIComponent(
            `${process.env.GATSTBY_BASE_URL}${withPrefix(
              "/sketch-library.xml"
            )}`
          )}`}
        >
          Add Library
        </a>
      </p>
    </div>
  );
};
