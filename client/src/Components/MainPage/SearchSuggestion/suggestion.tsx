import React from "react";
import "./suggestion.scss";

export const SuggestedUserCard: React.FC<{ Username: string; source: string }> =
  (props) => {
    const { Username, source } = props;
    return (
      <div id="suggested-user-card">
        <img src={source} alt="user-card" />
        <div>{Username}</div>
      </div>
    );
  };

const SuggestionContainer: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="suggestion-container">{children}</main>
    </React.Fragment>
  );
};

export default SuggestionContainer;