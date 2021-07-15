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
import { Convert2Dto1D, PostListSerialization, SpliceArray } from "./helper";
import axios, { CancelTokenSource } from "axios";
import { useInteractionObserver } from "../../Hooks/IntersectionObserver";
import SocketIOClient from "socket.io-client";
import SuggestionContainer, {
  SuggestedUserCard,
} from "../../Components/MainPage/SearchSuggestion/suggestion";
import { RespondToRequest } from "../../GraphQL/mutations";

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
const AsyncRequestContainer = React.lazy(
  () => import("../../Components/MainPage/RequestContainer/requests-container")
);

const FooterRef: React.FC<{ Reference: React.RefObject<HTMLDivElement> }> = ({
  Reference,
}) => {
  return (
    <footer ref={Reference} style={{ width: "100%", height: "2px" }}></footer>
  );
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
    setInitialRequest(false);
    return PostList;
  };

  // eslint-disable-next-line
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

  const [PostFetch, PostFetchConfig] = useLazyQuery(PostsData, {
    onCompleted: (data) => {
      const { GetPostsData }: { GetPostsData: Array<POSTS> | null } = data;
      if (GetPostsData) {
        const posts = AddPostsInPostState(GetPostsData);
        if (GetPostsData.length === 6) setIsFetchLimitReached(false);
        setPosts(posts);
        setReqestCount(request_count + 1);
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
      setRequests(GetProfileRequests.Requests);
    },
  });

  const [FollowRequestMutationCall] = useMutation(RespondToRequest);

  useEffect(() => {
    if (search_value.length === 1) {
      const regex = /^profile/;
      const pathName = window.location.pathname.split("/")[1];
      if (regex.exec(pathName)) {
        history.push("/posts");
      }
    }
  }, [search_value, history]);

  // RenderFunctions
  const ChangeSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.length > 3 && search_suggestion_loading) {
      cancelToken.current?.cancel();
    }

    if (value.length < 3) {
      search_suggestion && setSearchSuggestion(null);
    }

    if (value.length > 2) {
      const token = axios.CancelToken.source();
      cancelToken.current = token;
      setSearchSuggestionLoading(true);
      setTimeout(() => {
        axios
          .get(`/search-profile/${value}`, {
            cancelToken: token.token,
          })
          .then(({ data }) => {
            setSearchSuggestionLoading(false);
            setSearchSuggestion(data);
          })
          .catch(() => {});
      }, 254);
    }
  };

  const BlurSearchFocus = () => {
    if (search_suggestion) {
      setTimeout(() => {
        setSearchSuggestion(null);
        setSearchValue("");
      }, 150);
    }
  };

  const AcceptFollowRequest = (index: number) => {
    if (requests) {
      FollowRequestMutationCall({
        variables: {
          id: user_info?.userID,
          auth_token: user_info?.auth_token,
          uid: user_info?.uid,
          RequesterID: requests[index].extenderID,
          type: "Add",
        },
      });
      const dummy = [...requests];
      const new_array = SpliceArray(dummy, index);
      setRequests(new_array);
      socket?.emit("accept-follow-request", {
        id: user_info?.userID,
        username: user_info?.username,
      });
    }
  };

  const DeleteFollowRequest = (index: number) => {
    if (requests) {
      FollowRequestMutationCall({
        variables: {
          id: user_info?.userID,
          auth_token: user_info?.auth_token,
          uid: user_info?.uid,
          RequesterID: requests[index].extenderID,
          type: "Delete",
        },
      });
      const dummy = [...requests];
      const new_array = SpliceArray(dummy, index);
      setRequests(new_array);
    }
  };

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
    }
    setRequests([]);
  };

  const ChangeLikedPost = useCallback(
    (isLiked: boolean, id: string) => {
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

  const SendSocketRequest = useCallback(
    (id: string | undefined) => {
      if (id) {
        socket?.emit("/", user_info?.userID, id, user_info?.username);
      }
    },
    [socket, user_info]
  );

  const AddProflePicture = (pp: string) => {
    setProfilePicture(pp);
  }

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
    const io = SocketIOClient("https://localhost:8000").connect();
    io.emit("join-primary-room", localStorage.getItem("userID"));
    setSocket(io);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("real-time-request-receiver", (config: RequestConfig) => {
        if (config) AddRequests(config);
      });
    }
    return () => {
      socket?.disconnect();
    };
  });

  // const ChangeNavbarFromScroll = () => {
  //   if (NavBarRef.current) {
  //     const scrollY = window.scrollY;
  //     if (scrollY === 0 && NavBarRef.current.style.backgroundColor === 'rgb(254, 254, 254)') {
  //       NavBarRef.current.style.backgroundColor = ''
  //     }
  //     else if (scrollY > 10 && NavBarRef.current.style.backgroundColor === '') {
  //       NavBarRef.current.style.backgroundColor = 'rgb(254, 254, 254)'
  //     }
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener('scroll', ChangeNavbarFromScroll);
  //   return () => 
  //   document.removeEventListener('scroll', ChangeNavbarFromScroll);
  // })

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
                  SendSocketRequest={SendSocketRequest}
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
