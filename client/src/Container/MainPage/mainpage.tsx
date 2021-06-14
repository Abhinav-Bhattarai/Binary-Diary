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
import { FollowingListSerialization } from "./helper";

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

const MainPage: React.FC<PROPS> = (props) => {
  const [user_info, setUserinfo] = useState<UserInfo | null>(null);
  const [profile_data, setProfileData] = useState<null | UserData>(null);
  // const [following, setFollowing] = useState<Array<FollowingData> | null>(null);
  const [postid_list, setPostIDList] = useState<null | Array<string>>(null);
  const [posts, setPosts] = useState<null | Array<POSTS>>(null);
  const [prepoststate, setPrePostState] = useState<boolean>(true);
  const [search_value, setSearchValue] = useState<string>("");
  const [profile_picture, setProfilePicture] = useState<string>(DefaultProfile);
  const [request_count, setReqestCount] = useState<number>(0);
  const history = useHistory();

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
        const { FollowingList }: { FollowingList: Array<FollowingData> | null } = GetUserData;
        if (GetUserData.ProfilePicture.length > 0) setProfilePicture(GetUserData.ProfilePicture);
        if (FollowingList) {
          const sliced_post = FollowingListSerialization(FollowingList);
          const config = {
            id: localStorage.getItem("userID"),
            uid: localStorage.getItem("uid"),
            auth_token: localStorage.getItem("auth-token"),
            Posts: sliced_post,
            request_count,
          };
          setPostIDList(data);
          // setFollowing(FollowingList);
          PostFetch({ variables: config });
        };
        setProfileData(GetUserData)
      }
    },

    onError: (error) => console.log(error, "UserData")
  });

  const [PostFetch, PostFetchConfig] = useLazyQuery(PostsData, {
    onCompleted: ({ GetPostsData }) => {
      if (GetPostsData && posts) {
        if (prepoststate) {
          setPosts(GetPostsData);
          setPrePostState(false);
        } else {
          const dummy = [...posts];
          console.log(dummy);
          console.log(postid_list);
          setReqestCount(request_count + 1);
        }
      }
    },

    onError: (error) => console.log(error, "PostFetchConfig")
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

    onError: (error) => console.log(error, "PrePosts")
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
    (auth_token && username && userID && uid) && setUserinfo({ auth_token, username, userID, uid });
  }, []);

  if (loading === true || PrePosts.loading === true) {
    return <LoadingPage />;
  }

  if (PostFetchConfig.loading) {}

  return (
    <React.Fragment>
      <Context.Provider
        value={{ userInfo: user_info, ProfileData: profile_data, ProfilePicture: profile_picture }}
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
                  <AsyncPostContainer />
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
                  <AsyncPostContainer />
                </Suspense>
              );
            }}
          />
        </Switch>
      </Context.Provider>
    </React.Fragment>
  );
};

export default MainPageWrapper;
