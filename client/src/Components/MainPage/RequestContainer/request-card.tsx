import React from "react";
import "./style.scss";

interface ReactButtonProps {
  Click: () => void;
  color: string;
  name: string;
}

export const ReactButtonContainer: React.FC<{}> = ({ children }) => {
  return <main id="react-btn-container">{children}</main>;
};

export const ReactButton: React.FC<ReactButtonProps> = (props) => {
  const { Click, color, name } = props;
  return (
    <button
      id="request-react-btn"
      onClick={Click}
      style={{
        backgroundColor: color,
        color: color === "#ff385c" ? "#fff" : "#333",
      }}
    >
      {name}
    </button>
  );
};

export const RequesterImage: React.FC<{ source: string }> = ({ source }) => {
  return <img src={source} alt="requester-i" />;
};

export const RequesterUsername: React.FC<{ username: string }> = ({
  username,
}) => {
  return <div id="requester-username"> {username} </div>;
};

const RequestCard: React.FC<{}> = ({ children }) => {
  return <main id="request-card-container">{children}</main>;
};

export default RequestCard;