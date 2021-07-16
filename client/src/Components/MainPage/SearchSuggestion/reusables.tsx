import React from "react";
import "./suggestion.scss";
interface PROPS {
  Username: string;
  source: string;
  Click: (id: string) => void;
  id: string;
}

export const SuggestedUserCard: React.FC<PROPS> = (props) => {
  const { Username, source, Click, id } = props;
  return (
    <div id="suggested-user-card" onClick={Click.bind(this, id)}>
      <img src={source} alt="user-card" />
      <div>{Username}</div>
    </div>
  );
};