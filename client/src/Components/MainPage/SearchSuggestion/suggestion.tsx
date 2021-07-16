import React from "react";
import "./suggestion.scss";

const SuggestionContainer: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="suggestion-container">{children}</main>
    </React.Fragment>
  );
};

export default SuggestionContainer;
