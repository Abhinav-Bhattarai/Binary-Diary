import React, { useMemo } from "react";
import NoPostImage from "../../../assets/Images/no-post.svg";
import {
  POSTS,
  UserData,
  UserInfo,
} from "../../../Container/MainPage/interfaces";
import Spinner from "../../UI/Spinner/spinner";
import { MainPageContainer } from "../Reusables/reusables";
import { PostCardHeader } from "../PostCard/reusables";
import "../PostCard/post-card.scss";
import PostCard from "../PostCard/post-card";
import { GetPostLikeStatus } from "./helper";

interface PROPS {
  PostList: Array<POSTS> | null;
  ProfileData: UserData | null;
  UserInfo: UserInfo | null;
  spinner: boolean;
  initialRequest: boolean;
  ChangeLikedPosts: (type: boolean, id: string) => void;
}

const PostContainer: React.FC<PROPS> = (props) => {
  const {
    PostList,
    ProfileData,
    UserInfo,
    spinner,
    initialRequest,
    ChangeLikedPosts,
  } = props;
  
  const PostListMemo = useMemo(
    () => {
      if (PostList) {
        return (
          <React.Fragment>
            {PostList.map((post) => {
              const isPostLiked = GetPostLikeStatus(ProfileData, post);
              return (
                <PostCard
                  key={post._id}
                  id={post._id}
                  UserInfo={UserInfo}
                  isPostLiked={isPostLiked}
                  ChangeLikedPost={ChangeLikedPosts}
                  Post={post.Post}
                >
                  <PostCardHeader
                    Username={post.CreatorUsername}
                    source={post.ProfilePicture}
                  />
                </PostCard>
              );
            })}
          </React.Fragment>
        );
      }
    }, // eslint-disable-next-line
    [PostList]
  );

  if (initialRequest) {
    return (
      <div
        style={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );
  }
  console.log('post-container-rendered')
  if (PostList === null || PostList.length === 0) {
    return (
      <React.Fragment>
        <MainPageContainer>
          <img
            id="default-post-container-img"
            draggable={false}
            src={NoPostImage}
            alt="no-post"
            width="40%"
            height="300px"
            style={{ marginTop: "60px" }}
          />
          <div
            id="remarks"
            style={{ marginTop: "15px", cursor: "context-menu" }}
          >
            No Posts Available! Lonely Bastard
          </div>
        </MainPageContainer>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <MainPageContainer>
        {PostListMemo}
        {spinner && <Spinner />}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(PostContainer);
