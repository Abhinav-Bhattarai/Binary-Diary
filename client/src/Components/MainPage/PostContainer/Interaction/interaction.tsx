import React from "react";
import { IconContext } from "react-icons";
import "./interaction.scss";

interface InteractantsProps {
  hoverColor: string;
  Click: (id: string) => void;
  id: string;
}

export function IconContainer({
  color,
  Click,
  children,
}: {
  color: string;
  Click: () => void;
  children: React.ReactNode;
}) {
  return (
    <span onClick={Click}>
      <IconContext.Provider
        value={{
          style: {
            color,
            fontSize: "30px",
            transition: "0.3s",
            cursor: "pointer",
          },
          className: color === "" ? "interaction-icon" : "",
        }}
      >
        {children}
      </IconContext.Provider>
    </span>
  );
}

export const Interactants: React.FC<InteractantsProps> = (props) => {
  const { Click, hoverColor, children, id } = props;
  return (
    <main id="interactants-container">
      <IconContainer color={hoverColor} Click={Click.bind(this, id)}>
        {children}
      </IconContainer>
    </main>
  );
};

const InteractionContainer: React.FC<{}> = ({ children }) => {
  return <div id="interaction-container">{children}</div>;
};

export default InteractionContainer;
