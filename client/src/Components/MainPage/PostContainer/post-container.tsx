import React from "react";
import { POSTS } from "../../../Container/MainPage/interfaces";
import { MainPageContainer } from "../Reusables/reusables";
import PostCard, { PostCardImageContainer } from "./PostCard/post-card";

interface PROPS {
  PostList: Array<POSTS> | null;
  reference: React.RefObject<HTMLDivElement>;
}

const PostContainer: React.FC<PROPS> = (props) => {
  const { PostList, reference } = props;
  return (
    <React.Fragment>
      <MainPageContainer>
        {PostList?.map((post) => {
          return (
            <PostCard key={post._id}>
              <PostCardImageContainer source={post.Post} />
            </PostCard>
          );
        })}
        <footer ref={reference}></footer>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(PostContainer);
