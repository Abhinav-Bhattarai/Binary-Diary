import React from "react";
import DefaultProfile from "../../../assets/Images/profile-user.svg";
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
        color: color === "#00acee" ? "#fff" : "#333",
      }}
    >
      {name}
    </button>
  );
};

export const RequesterImage: React.FC<{ source: string }> = ({ source }) => {
  return (
    <img
      id='request-card-img'
      draggable={false}
      src={source.length > 0 ? source : DefaultProfile}
      alt="requester-i"
    />
  );
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
