import React from "react";
import { withPrefix } from "gatsby";

export default ({ pageContext }: { pageContext: { baseURL: string } }) => {
  return (
    <div>
      <p>Download the figma plugin</p>
      <p>
        Add the Sketch library:{" "}
        <a
          href={`sketch://add-library?url=${encodeURIComponent(
            `${pageContext.baseURL}${withPrefix("/sketch-library.xml")}`
          )}`}
        >
          Add Library
        </a>
      </p>
    </div>
  );
};
