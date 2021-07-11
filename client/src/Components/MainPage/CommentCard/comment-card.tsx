import React from "react";
import { COMMENTS } from "./inteface";
import { CommentCardContainer } from "./reusables";
import "./style.scss";

interface PROPS {
  Comments: Array<COMMENTS>;
}

let CommentList = () => {
  return <></>;
};

const CommentSection: React.FC<PROPS> = (props) => {
  const { Comments } = props;

  if (Comments.length > 0) {
    CommentList = () => {
      return (
        <React.Fragment>
          {Comments.map((comment) => {
            return (
              <CommentCardContainer key={comment._id}></CommentCardContainer>
            );
          })}
        </React.Fragment>
      );
    };
  }
  return (
    <React.Fragment>
      <main id="comment-section">
        <CommentList />
      </main>
    </React.Fragment>
  );
};

export default React.memo(CommentSection);
