import React, { useEffect, useState, Suspense } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import { UserInfo, PROPS, POSTS } from "./interfaces";
import { Context } from "./Context";
import {
  FetchUserData,
  PostsData,
  PrePostData,
} from "../../GraphQL/main-page-gql";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import Navbar from "../../Components/MainPage/Navbar/navbar";
import DefaultProfile from '../../assets/Images/profile-user.svg';
import { Switch, Route } from "react-router";

const client = new ApolloClient({
  uri: "https://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const AsyncPostContainer = React.lazy(() => import('../../Components/MainPage/PostContainer/post-container'));
const AsyncMessageContainer = React.lazy(() => import('../../Components/MainPage/MessageContainer/message-container'));
const AsyncProfileContainer = React.lazy(() => import('../../Components/MainPage/ProfileContainer/profile-container'));

const Convert2Dto1D = (Array: Array<string>) => {
  const dummy = [];
  // O(n^2)
  for (let userInfo of Array) {
    for (let posts of userInfo) {
      dummy.push(posts);
    }
  }
  return dummy;
};

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
  const [postid_list, setPostIDList] = useState<null | Array<string>>(null);
  const [posts, setPosts] = useState<null | Array<POSTS>>(null);
  const [prepoststate, setPrePostState] = useState<boolean>(false);
  const [search_value, setSearchValue] = useState<string>("");
  const [profile_picture, setProfilePicture] = useState<string>(DefaultProfile);
  
  // apollo-client queries;

  const { loading } = useQuery(FetchUserData, {
    variables: {
      id: localStorage.getItem("userID"),
      uid: localStorage.getItem("uid"),
    },

    onCompleted: (data) => {
      const { GetUserData } = data;
      const { FollowingList } = GetUserData;
      GetUserData.ProfilePicture.length > 0 && setProfilePicture(GetUserData.ProfilePicture);
      if (FollowingList) {
        let data: string[] = [];
        if (FollowingList.length > 0) data = Convert2Dto1D(FollowingList);
        setPostIDList(data);
      }
    },

    onError: (error) => {
      console.log(error, "UserData");
    },
  });
  const [, PostFetch] = useLazyQuery(PostsData, {
    onCompleted: ({ GetPostsData }) => {
      if (GetPostsData && posts) {
        if (prepoststate) {
          setPosts(GetPostsData);
          setPrePostState(false);
        } else {
          const dummy = [...posts];
          console.log(dummy);
          console.log(postid_list);
        }
      }
    },

    onError: (error) => {
      console.log(error, "PostFetch");
    },
  });

  const PrePosts = useQuery(PrePostData, {
    variables: {
      id: localStorage.getItem("userID"),
      auth_token: localStorage.getItem("auth-token"),
    },

    onCompleted: (data) => {
      const { GetPrePostData } = data;
      setPrePostState(true);
      GetPrePostData && setPosts(GetPrePostData);
    },

    onError: (error) => {
      console.log(error, "PrePosts");
    },
  });

  // RenderFunctions

  const ChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  // SideEffects and Effects;

  useEffect(() => {
    const auth_token = localStorage.getItem("auth-token");
    const username = localStorage.getItem("username");
    const userID = localStorage.getItem("userID");
    auth_token &&
      username &&
      userID &&
      setUserinfo({ auth_token, username, userID });
  }, []);

  if (loading === true || PrePosts.loading === true) {
    return <LoadingPage />;
  };

  if (PostFetch.loading) {}

  return (
    <React.Fragment>
      <Context.Provider value={{ userInfo: user_info, ProfilePicture: profile_picture }}>
        <Navbar change={ChangeSearchValue} value={search_value}/>
        <Switch>
          <Route exact path='/posts' render={() => {
            return (
              <Suspense fallback={<LoadingPage/>}>
                <AsyncPostContainer/>
              </Suspense>
            )
          }}/>
          <Route exact path='/profile/:id' render={() => {
            return (
              <Suspense fallback={<LoadingPage/>}>
                <AsyncProfileContainer/>
              </Suspense>
            )
          }}/>
          <Route exact path='/messages' render={() => {
            return (
              <Suspense fallback={<LoadingPage/>}>
                <AsyncMessageContainer/>
              </Suspense>
            )
          }}/>
          <Route render={() => {
            return (
              <Suspense fallback={<LoadingPage/>}>
                <AsyncPostContainer/>
              </Suspense>
            )
          }}/>
        </Switch>
      </Context.Provider>
    </React.Fragment>
  );
};

export default MainPageWrapper;