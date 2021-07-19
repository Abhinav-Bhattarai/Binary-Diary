import React, {
  useEffect,
  useState,
  Suspense,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  UserInfo,
  PROPS,
  POSTS,
  UserData,
  FollowingData,
  Suggestion,
  RequestConfig,
} from "./interfaces";
import {
  FetchProfileRequests,
  FetchUserData,
  PostsData,
} from "../../GraphQL/gql";
import LoadingPage from "../../Components/UI/LoadingPage/LoadingPage";
import Navbar from "../../Components/MainPage/Navbar/navbar";
import DefaultProfile from "../../assets/Images/profile-user.svg";
import { Switch, Route, useHistory } from "react-router";
import {
  AsyncMessageContainer,
  AsyncPostContainer,
  AsyncProfileContainer,
  AsyncRequestContainer,
  Convert2Dto1D,
  FooterRef,
  LocalStorageDataValidity,
  PostListSerialization,
  RemoveAcceptedRequestFromList,
} from "./helper";
import axios, { CancelTokenSource } from "axios";
import { useInteractionObserver } from "../../Hooks/IntersectionObserver";
import SocketIOClient from "socket.io-client";
import SuggestionContainer from "../../Components/MainPage/SearchSuggestion/suggestion";
import { SuggestedUserCard } from "../../Components/MainPage/SearchSuggestion/reusables";
import { RespondToRequest } from "../../GraphQL/mutations";

const client = new ApolloClient({
  uri: "https://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

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
  const { ChangeAuthentication } = props;

  // states
  const [user_info, setUserinfo] = useState<UserInfo | null>(null);
  const [profile_data, setProfileData] = useState<null | UserData>(null);
  const [postid_list, setPostIDList] = useState<null | Array<string>>(null);
  const [posts, setPosts] = useState<null | Array<POSTS>>(null);
  const [search_value, setSearchValue] = useState<string>("");
  const [profile_picture, setProfilePicture] = useState<string>(DefaultProfile);
  const [isfetchlimitreached, setIsFetchLimitReached] = useState<boolean>(false);
  const [request_count, setReqestCount] = useState<number>(0);
  const [search_suggestion, setSearchSuggestion] = useState<Array<Suggestion> | null>(null);
  const [search_suggestion_loading, setSearchSuggestionLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<null | Array<RequestConfig>>(null);
  const [requested, setRequested] = useState<Array<string> | null>(null);
  const [socket, setSocket] = useState<null | SocketIOClient.Socket>(null);
  const [initialRequest, setInitialRequest] = useState<boolean>(true);

  // hooks and refs
  const LastCardRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const NavBarRef = useRef<HTMLDivElement>(null);
  const cancelToken = useRef<CancelTokenSource>();
  const isInteracting = useInteractionObserver(LastCardRef);

  // apollo-client helper functions
  const AddPostsInPostState = (PostList: Array<POSTS>) => {
    if (posts) {
      const dummy = [...posts];
      for (let post of PostList) {
        dummy.push(post);
      }
      return dummy;
    }
    setInitialRequest(false);
    return PostList;
  };  

  const FetchMorePosts = () => {
    if (postid_list) {
      const SlicedPostIDs = PostListSerialization(postid_list, request_count);
      const config = {
        id: localStorage.getItem("userID"),
        uid: localStorage.getItem("uid"),
        auth_token: localStorage.getItem("auth-token"),
        Posts: SlicedPostIDs,
      };
      PostFetch({ variables: config });
    }
  };

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
        if (GetUserData.Error !== true) {
          const { FollowingList }: { FollowingList: Array<FollowingData> } = GetUserData;
          if (GetUserData.ProfilePicture.length > 0) setProfilePicture(GetUserData.ProfilePicture);
          setRequested(GetUserData.Requested);
          if (FollowingList.length > 0) {
            const postIDs = Convert2Dto1D(FollowingList);
            const SlicedPostIDs = PostListSerialization(postIDs, 0);
            const config = {
              id: localStorage.getItem("userID"),
              uid: localStorage.getItem("uid"),
              auth_token: localStorage.getItem("auth-token"),
              Posts: SlicedPostIDs,
            };
            setPostIDList(postIDs);
            PostFetch({ variables: config });
          } else {
            setInitialRequest(false);
          }
          setProfileData(GetUserData);
        }
      }
    },
  });

  useQuery(FetchProfileRequests, {
    variables: {
      id: localStorage.getItem("userID"),
      uid: localStorage.getItem("uid"),
      auth_token: localStorage.getItem("auth-token"),
    },
    onCompleted: (data) => {
      const { GetProfileRequests } = data;
      if (GetProfileRequests.Error !== true) setRequests(GetProfileRequests.Requests);
    },
  });

  // lazy-queries
  const [PostFetch, PostFetchConfig] = useLazyQuery(PostsData, {
    onCompleted: (data) => {
      const { GetPostsData }: { GetPostsData: Array<POSTS> } = data;
      if (GetPostsData.length > 0) {
        if (GetPostsData[0].Error === true) {
          setIsFetchLimitReached(true);
          setPosts([]);
          return 
        }
      }
      const posts = AddPostsInPostState(GetPostsData);
      if (GetPostsData.length === 6) setIsFetchLimitReached(false);
      setPosts(posts);
      setReqestCount(request_count + 1);
    },
  });

  // mutations
  const [FollowRequestMutationCall] = useMutation(RespondToRequest);

  // RenderFunctions
  const HomePressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
  history.push("/posts");

  const SuggestionPressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push("/follow-requests");

  const MessagesPressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push("/messages");

  const ProfilePressHandler = (event: React.MouseEvent<HTMLDivElement>) =>
    history.push(`/profile/${user_info?.userID}/1`);

  const SearchProfilePressHandler = (id: string) => {
    setSearchSuggestion(null);
    history.push(`/profile/${id}/0`);
  };

  const ChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > 3 && search_suggestion_loading) cancelToken.current?.cancel();
    if (value.length < 3) search_suggestion && setSearchSuggestion(null);

    if (value.length > 2) {
      const token = axios.CancelToken.source();
      cancelToken.current = token;
      setSearchSuggestionLoading(true);
      setTimeout(() => {
        axios
          .get(`https://localhost:8000/search-profile/${value}`, {
            cancelToken: token.token,
          })
          .then(({ data }) => {
            setSearchSuggestionLoading(false);
            setSearchSuggestion(data);
          })
          .catch(() => {});
      }, 200);
    }
    setSearchValue(value);
  };

  const BlurSearchFocus = () => {
    if (search_suggestion) {
      setTimeout(() => {
        setSearchSuggestion(null);
        setSearchValue("");
      }, 150);
    }
  };

  const DeleteRequests = (index: number) => {
    if (requests) {
      const dummy = [...requests];
      const new_array = RemoveAcceptedRequestFromList(dummy, index);
      setRequests(new_array);
    }
  } 

  const AcceptFollowRequest = useCallback((index: number) => {
    if (requests && user_info) {
      FollowRequestMutationCall({
        variables: {
          id: user_info.userID,
          auth_token: user_info.auth_token,
          uid: user_info.uid,
          RequesterID: requests[index].extenderID,
          type: "Add",
        },
      });
      DeleteRequests(index);
    }
  }, // eslint-disable-next-line 
  [user_info, requests]);

  const DeleteFollowRequest = useCallback((index: number) => {
    if (requests && user_info) {
      FollowRequestMutationCall({
        variables: {
          id: user_info.userID,
          auth_token: user_info.auth_token,
          uid: user_info.uid,
          RequesterID: requests[index].extenderID,
          type: "Delete",
        },
      });
      DeleteRequests(index);
    }
  }, // eslint-disable-next-line
  [user_info, requests]);

  const AddRequests = (config: RequestConfig) => {
    if (requests) {
      const SerializedConfig = {
        Username: config.Username,
        extenderID: config.extenderID,
        ProfilePicture:
          config.ProfilePicture.length > 0
            ? config.ProfilePicture
            : DefaultProfile,
      };
      if (requests.length > 0) {
        const dummy = [...requests];
        dummy.push(SerializedConfig);
        setRequests(dummy);
      } else {
        setRequests([SerializedConfig]);
      }
    } else {
      setRequests([]);
    }
  };

  const ChangeLikedPost = useCallback((isLiked: boolean, id: string) => {
      if (profile_data) {
        const dummy = [...profile_data.LikedPosts];
        if (isLiked) {
          for (let dataIndex in dummy) {
            if (dummy[dataIndex] === id) {
              dummy.splice(parseInt(dataIndex), 1);
              break;
            }
          }
        } else {
          dummy.push(id);
        }
        setProfileData({ ...profile_data, LikedPosts: dummy });
      }
    },
    [profile_data]
  );

  const AddProflePicture = useCallback((pp: string) => {
    setProfilePicture(pp);
  }, []);

  // SideEffects and Effects;
  useEffect(() => {
    const UserInfo = LocalStorageDataValidity();
    UserInfo && setUserinfo(UserInfo);
  }, []);

  useEffect(() => {
    if (search_value.length === 1) {
      const regex = /^profile/;
      const pathName = window.location.pathname.split("/")[1];
      if (regex.exec(pathName)) {
        history.push("/posts");
      }
    }
  }, [search_value, history]);

  useEffect(() => {
    const io = SocketIOClient("https://localhost:8000").connect();
    io.emit("join-primary-room", localStorage.getItem("userID"));
    setSocket(io);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("real-time-request-receiver", (config: RequestConfig) => {
        if (config) AddRequests(config);
      });

      return () => {
        socket.removeAllListeners();
      };
    }
  });

  useEffect(
    () => {
      if (postid_list) {
        if (
          isInteracting === true &&
          isfetchlimitreached === false &&
          postid_list.length > 6
        ) {
          FetchMorePosts();
          setIsFetchLimitReached(true);
        }
      }
    }, // eslint-disable-next-line
    [isInteracting]
  );

  // memomization and conditional renderings
  const Suggestions = useMemo(
    () => {
      if (search_suggestion) {
        if (search_suggestion.length > 0) {
          const dummy = [...search_suggestion];
          return (
            <>
              <SuggestionContainer>
                {dummy.map((data) => {
                  return (
                    <SuggestedUserCard
                      id={data.id}
                      Click={SearchProfilePressHandler}
                      key={data.id}
                      Username={data.Username}
                      source={
                        data.ProfilePicture.length > 0
                          ? data.ProfilePicture
                          : DefaultProfile
                      }
                    />
                  );
                })}
              </SuggestionContainer>
            </>
          );
        }
      }
    }, // eslint-disable-next-line
    [search_suggestion]
  );

  if (loading === true) {
    return <LoadingPage />;
  }

  return (
    <React.Fragment>
      <Navbar
        HomePressHandler={HomePressHandler}
        MessagesPressHandler={MessagesPressHandler}
        ProfilePressHandler={ProfilePressHandler}
        SuggestionPressHandler={SuggestionPressHandler}
        change={ChangeSearchValue}
        value={search_value}
        ProfilePicture={profile_picture}
        Username={user_info?.username}
        Blur={BlurSearchFocus}
        reference={NavBarRef}
      />
      {Suggestions}
      <Switch>
        <Route
          exact
          path="/posts"
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncPostContainer
                  ProfileData={profile_data}
                  PostList={posts}
                  UserInfo={user_info}
                  spinner={PostFetchConfig.loading}
                  initialRequest={initialRequest}
                  ChangeLikedPosts={ChangeLikedPost}
                />
                <FooterRef Reference={LastCardRef} />
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
                <AsyncProfileContainer
                  Requested={requested}
                  userInfo={user_info}
                  ProfilePicture={profile_picture}
                  ProfileData={profile_data}
                  ChangeAuthentication={ChangeAuthentication}
                  ChangeLikedPosts={ChangeLikedPost}
                  socket={socket}
                  AddProfilePictureGlobally={AddProflePicture}
                />
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
          path="/follow-requests"
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncRequestContainer
                  AcceptRequest={AcceptFollowRequest}
                  DeleteRequest={DeleteFollowRequest}
                  requestList={requests}
                />
              </Suspense>
            );
          }}
        />
        <Route
          render={() => {
            return (
              <Suspense fallback={<LoadingPage />}>
                <AsyncPostContainer
                  ProfileData={profile_data}
                  PostList={posts}
                  UserInfo={user_info}
                  spinner={PostFetchConfig.loading}
                  initialRequest={initialRequest}
                  ChangeLikedPosts={ChangeLikedPost}
                />
                <FooterRef Reference={LastCardRef} />
              </Suspense>
            );
          }}
        />
      </Switch>
    </React.Fragment>
  );
});

export default React.memo(MainPageWrapper);