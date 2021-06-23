import React from "react";
import { POSTS } from "../../../Container/MainPage/interfaces";
import { MainPageContainer } from "../Reusables/reusables";
import PostCard, { PostCardHeader, PostCardImageContainer } from "./PostCard/post-card";

interface PROPS {
  PostList: Array<POSTS> | null;
  reference: React.RefObject<HTMLDivElement>;
}

const PostContainer: React.FC<PROPS> = (props) => {
  const { PostList, reference } = props;
  if (PostList === null) {
    return <React.Fragment></React.Fragment>
  }
  return (
    <React.Fragment>
      <MainPageContainer>
        {PostList?.map((post) => {
          return (
            <PostCard key={post._id}>
              <PostCardHeader Username={post.CreatorUsername} source={post.ProfilePicture}/>
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
