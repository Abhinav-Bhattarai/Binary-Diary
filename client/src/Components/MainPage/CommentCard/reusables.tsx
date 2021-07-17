import React from "react";
import { IoMdSend } from "react-icons/io";
import { Logo } from "../ProfileContainer/reusables";
import "./style.scss";

interface COMMENTINPUT {
  reference: React.RefObject<HTMLTextAreaElement>;
  EditableRef: React.RefObject<HTMLDivElement>;
}

export const CommentCardContainer: React.FC<{}> = ({ children }) => {
  return <main id="comment-card-container">{children}</main>;
};

export const CommenterProfile: React.FC<{ soruce: string }> = (props) => {
  return (
    <img src={props.soruce} alt="commenter-profile" id="commenter-profile" />
  );
};

export const CommentDataContainer: React.FC<{}> = ({ children }) => {
  return <article id="comment-data-container">{children}</article>;
};

export const CommenterNameArea: React.FC<{ username: string }> = ({
  username,
}) => {
  return <div id="commenter-username">{username}</div>;
};

export const CommentArea: React.FC<{ comment: string }> = ({ comment }) => {
  return <div id="comment">{comment}</div>;
};

export const CommentInput: React.FC<COMMENTINPUT> = (props) => {
  const { reference, EditableRef } = props;
  return (
    <main id="comment-input-container">
      <div
        ref={EditableRef}
        id="comment-input"
        contentEditable="true"
        role="textbox"
      >
        {reference.current && reference.current.value}
      </div>
      <div id="send-logo-container">
        <Logo className="send-icon" fontSize="22px">
          <IoMdSend />
        </Logo>
      </div>
      <textarea ref={reference} hidden />
    </main>
  );
};
