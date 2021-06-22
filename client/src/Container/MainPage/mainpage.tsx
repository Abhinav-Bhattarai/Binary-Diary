import React, { useEffect, useState, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { UserInfo, PROPS, POSTS, UserData, FollowingData } from "./interfaces";
import { Context } from "./Context";
import { FetchUserData, PostsData, PrePostData } from "../../GraphQL/gql";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import Navbar from "../../Components/MainPage/Navbar/navbar";
import DefaultProfile from "../../assets/Images/profile-user.svg";
import { Switch, Route, useHistory } from "react-router";
import { Convert2Dto1D, PostListSerialization } from "./helper";
import { useRef } from "react";
import { useInteractionObserver } from "../../Hooks/InteractionObserver";

const client = new ApolloClient({
  uri: "https://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const AsyncPostContainer = React.lazy(
  () => import("../../Components/MainPage/PostContainer/post-container")
);
const AsyncMessageContainer = React.lazy(
  () => import("../../Components/MainPage/MessageContainer/message-container")
);
const AsyncProfileContainer = React.lazy(
  () => import("../../Components/MainPage/ProfileContainer/profile-container")
);
const AsyncSuggestionContainer = React.lazy(
  () =>
    import("../../Components/MainPage/SuggestionContainer/suggestion-container")
);

const MainPageWrapper: React.FC<PROPS> = (props) => {
  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <MainPage {...props} />
      </ApolloProvider>
    </React.Fragment>
  );
};

const MainPage: React.FC<PROPS> = React.memo((props) => {
  const [user_info, setUserinfo] = useState<UserInfo | null>(null);
  const [profile_data, setProfileData] = useState<null | UserData>(null);
  const [postid_list, setPostIDList] = useState<null | Array<string>>(null);
  const [posts, setPosts] = useState<null | Array<POSTS>>(null);
  const [prepoststate, setPrePostState] = useState<boolean>(true);
  const [search_value, setSearchValue] = useState<string>("");
  const [profile_picture, setProfilePicture] = useState<string>(DefaultProfile);
  const [isfetchlimitreached, setIsFetchLimitReached] = useState<boolean>(false);
  const [request_count, setReqestCount] = useState<number>(0);
  const LastCardRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const isInteracting = useInteractionObserver(LastCardRef);

  // apollo-client queries;
  const { loading } = useQuery(FetchUserData, {
    variables: {
      id: localStorage.getItem("userID"),
      uid: localStorage.getItem("uid"),
      auth_token: localStorage.getItem("auth-token"),
    },

    onCompleted: (data) => {
      const { GetUserData }: { GetUserData: UserData | null } = data;
      if (GetUserData) {
        const { FollowingList }: { FollowingList: Array<FollowingData> } =
          GetUserData;
        if (GetUserData.ProfilePicture.length > 0) {
          setProfilePicture(GetUserData.ProfilePicture);
        }
        if (FollowingList.length > 0) {
          const postIDs = Convert2Dto1D(FollowingList);
          const SlicedPostIDs = PostListSerialization(postIDs, 0);
          const config = {
            id: localStorage.getItem("userID"),
            uid: localStorage.getItem("uid"),
            auth_token: localStorage.getItem("auth-token"),
            Posts: SlicedPostIDs,
            request_count,
          };
          setPostIDList(postIDs);
          PostFetch({ variables: config });
        }
        setProfileData(GetUserData);
      }
    },
  });

  const AddPostsInPostState = (PostList: Array<POSTS>) => {
    if (posts) {
      const dummy = [...posts];
      for (let post of PostList) {
        dummy.push(post);
      }
      return dummy;
    }
    return [];
  };

  // eslint-disable-next-line
  const FetchMorePosts = () => {
    if (postid_list) {
      const SlicedPostIDs = PostListSerialization(
        postid_list,
        request_count
      );
      const config = {
        id: localStorage.getItem("userID"),
        uid: localStorage.getItem("uid"),
        auth_token: localStorage.getItem("auth-token"),
        Posts: SlicedPostIDs,
        request_count,
      };
      PostFetch({ variables: config });
    }
  };

  const [PostFetch, PostFetchConfig] = useLazyQuery(PostsData, {
    onCompleted: (data) => {
      const { GetPostsData }: { GetPostsData: Array<POSTS> | null } = data;
      if (GetPostsData && posts) {
        if (prepoststate) {
          setPosts(GetPostsData);
          setPrePostState(false);
        } else {
          const posts = AddPostsInPostState(GetPostsData);
          setPosts(posts);
        }
        if (GetPostsData.length === 6) setIsFetchLimitReached(false);
        setReqestCount(request_count + 1);
      }
    },
  });

  const PrePosts = useQuery(PrePostData, {
    variables: {
      id: localStorage.getItem("userID"),
      auth_token: localStorage.getItem("auth-token"),
      uid: localStorage.getItem("uid"),
    },

    onCompleted: (data) => {
      const { GetPrePostData } = data;
      GetPrePostData && setPosts(GetPrePostData);
    },
  });

  // RenderFunctions

  const ChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const HomePressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push("/posts");

  const SuggestionPressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push("/suggestions");

  const MessagesPressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push("/messages");

  const ProfilePressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push(`/profile/${user_info?.userID}/1`);

  // SideEffects and Effects;

  useEffect(() => {
    const auth_token = localStorage.getItem("auth-token");
    const username = localStorage.getItem("username");
    const userID = localStorage.getItem("userID");
    const uid = localStorage.getItem("uid");
    auth_token &&
      username &&
      userID &&
      uid &&
      setUserinfo({ auth_token, username, userID, uid });
  }, []);

  useEffect(() => {
    if (isInteracting === true && isfetchlimitreached === false) {
      FetchMorePosts();
      setIsFetchLimitReached(true);
    }
  }, // eslint-disable-next-line 
  [isInteracting])

  if (loading === true || PrePosts.loading === true) {
    return <LoadingPage />;
  }

  if (PostFetchConfig.loading) {
  }

  return (
    <React.Fragment>
      <Context.Provider
        value={{
          userInfo: user_info,
          ProfileData: profile_data,
          ProfilePicture: profile_picture,
        }}
      >
        <Navbar
          HomePressHandler={HomePressHandler}
          MessagesPressHandler={MessagesPressHandler}
          ProfilePressHandler={ProfilePressHandler}
          SuggestionPressHandler={SuggestionPressHandler}
          change={ChangeSearchValue}
          value={search_value}
        />
        <Switch>
          <Route
            exact
            path="/posts"
            render={() => {
              return (
                <Suspense fallback={<LoadingPage />}>
                  <AsyncPostContainer
                    reference={LastCardRef}
                    PostList={posts}
                  />
                </Suspense>
              );
            }}
          />
          <Route
            exact
            path="/profile/:id/:owned"
            render={() => {
              return (
                <Suspense fallback={<LoadingPage />}>
                  <AsyncProfileContainer />
                </Suspense>
              );
            }}
          />
          <Route
            exact
            path="/messages"
            render={() => {
              return (
                <Suspense fallback={<LoadingPage />}>
                  <AsyncMessageContainer />
                </Suspense>
              );
            }}
          />
          <Route
            exact
            path="/suggestions"
            render={() => {
              return (
                <Suspense fallback={<LoadingPage />}>
                  <AsyncSuggestionContainer />
                </Suspense>
              );
            }}
          />
          <Route
            render={() => {
              return (
                <Suspense fallback={<LoadingPage />}>
                  <AsyncPostContainer
                    reference={LastCardRef}
                    PostList={posts}
                  />
                </Suspense>
              );
            }}
          />
        </Switch>
      </Context.Provider>
    </React.Fragment>
  );
});

export default React.memo(MainPageWrapper);
