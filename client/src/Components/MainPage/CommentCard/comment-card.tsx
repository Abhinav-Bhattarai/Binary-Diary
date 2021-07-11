import React from "react";
import { COMMENTS } from "./inteface";
import DefaultProfile from "../../../assets/Images/profile-user.svg";

import {
  CommentArea,
  CommentCardContainer,
  CommentDataContainer,
  CommenterNameArea,
  CommenterProfile,
} from "./reusables";
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
            <CommentCardContainer key={comment._id}>
              <CommenterProfile
                soruce={
                  comment.ProfilePicture.length > 0
                    ? comment.ProfilePicture
                    : DefaultProfile
                }
              />
              <CommentDataContainer>
                <CommenterNameArea username={comment.CommenterUsername} />
                <CommentArea comment={comment.Comment} />
              </CommentDataContainer>
            </CommentCardContainer>
          );
        })}
      </main>
    </React.Fragment>
  );
};

export default React.memo(CommentSection);
