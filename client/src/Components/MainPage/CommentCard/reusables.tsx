import React from "react";
import './style.scss';

export const CommentCardContainer: React.FC<{}> = ({ children }) => {
  return <main id="comment-card-container">{children}</main>;
};

export const CommenterProfile: React.FC<{soruce: string}> = (props) => {
  return <img src={props.soruce} alt='commenter-profile' id='commenter-profile'/>
};

export const CommentDataContainer: React.FC<{}> = ({ children }) => {
  return (
    <article id='comment-data-container'>
      { children }
    </article>
  )
};

export const CommenterNameArea: React.FC<{username: string}> = ({ username }) => {
  return <div id='commenter-username'>{ username }</div>
};

export const CommentArea: React.FC<{comment: string}> = ({ comment }) => {
  return <div id='comment'>{ comment }</div>
};