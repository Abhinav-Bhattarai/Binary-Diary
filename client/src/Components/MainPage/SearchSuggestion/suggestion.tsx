import React from "react";
import "./suggestion.scss";

export const SuggestedUserCard: React.FC<{
  Username: string;
  source: string;
  Click: (id: string) => void;
  id: string;
}> = (props) => {
  const { Username, source, Click, id } = props;
  return (
    <div id="suggested-user-card" onClick={Click.bind(this, id)}>
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
