import React from "react";
import { COMMENTS } from "./inteface";
import { CommentCardContainer } from "./reusables";
import "./style.scss";

interface PROPS {
  Comments: Array<COMMENTS>;
}

const CommentSection: React.FC<PROPS> = (props) => {
  const { Comments } = props;
  return (
    <React.Fragment>
      <main id="comment-section">
        {Comments.map((comment) => {
          return (
            <CommentCardContainer key={comment._id}></CommentCardContainer>
          );
        })}
      </main>
    </React.Fragment>
  );
};

export default React.memo(CommentSection);
