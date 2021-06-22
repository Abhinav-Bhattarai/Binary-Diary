import React from "react";

export const PostCardImageContainer: React.FC<{ source: string }> = (props) => {
  return (
    <header id="post-card-img-container">
      <img src={props.source} alt="post" />
    </header>
  );
};

const PostCard: React.FC<{}> = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      <main id="post-card-container">
        {children}
      </main>
    </React.Fragment>
  );
};

export default PostCard;