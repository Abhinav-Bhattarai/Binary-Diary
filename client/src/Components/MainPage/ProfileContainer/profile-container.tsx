import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Transition } from "react-transition-group";
import { AiOutlinePlus, AiOutlineProfile } from "react-icons/ai";
import { BiCog } from "react-icons/bi";
import { useLazyQuery, useMutation } from "@apollo/client";

import "./profile-container.scss";
import { ImageSelector, MainPageContainer } from "../Reusables/reusables";
import { PopupHeader, PopupImageContainer } from "../Reusables/reusables";
import { contextData } from "../../../Container/MainPage/Context";
import { FetchMoreProfilePosts, ProfileDataFetch } from "../../../GraphQL/gql";
import {
  GetProfileDataProps,
  PostListType,
  ProfilePostDetailsType,
  SerializedProfile,
} from "../interfaces";
import Spinner from "../../UI/Spinner/spinner";
import DefaultProfile from "../../../assets/Images/profile-user.svg";
import { DetermineFetchLimit, GetNewSlicedProfileData, resizeFile, SerializeNewPosts, SerializeProfileData } from "./helper";
import {
  ProfileHeaderContainer,
  ProfilePostAreaContainer,
  ProfileHeaderInfo,
  ProfileHeaderImageContainer,
  ProfileInformationOverView,
  ProfilePostArea,
  ProfilePostOverview,
  ProfileConfigurationContainer,
  Logo,
  ConfigLogoContainer,
  SettingsOverViewPopup,
  SettingsOverViewElement,
  ProfileStateButton,
  Paginate,
} from "./reusables";
import { AddPost, MutateProfilePicture } from "../../../GraphQL/mutations";
import { UserData, UserInfo } from "../../../Container/MainPage/interfaces";
import useProfileParams from "../../../Hooks/profileHook";
import { GetPostLikeStatus } from "../PostContainer/helper";
interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
  userInfo: UserInfo | null;
  ProfilePicture: string;
  ProfileData: UserData | null;
  Requested: Array<string> | null;
  ChangeLikedPosts: (type: boolean, id: string) => void;
  AddProfilePictureGlobally: (profile_picture: string) => void;
  socket: SocketIOClient.Socket | null;
}

const AsyncBigPopupContainer = React.lazy(() => import("../Reusables/reusables"));
const AsyncDetailedPostContainer = React.lazy(() => import("./reusables"));
const transition_duration: number = 500;

const ProfileContainer: React.FC<PROPS> = (props) => {
  const {
    ChangeAuthentication,
    userInfo,
    ProfilePicture,
    ProfileData,
    Requested,
    ChangeLikedPosts,
    AddProfilePictureGlobally,
    socket,
  } = props;


  // states
  const [profile_info, setProfileInfo] = useState<contextData | SerializedProfile>
  ({
    ProfilePicture,
    ProfileData,
    userInfo,
  });
  const [transitioning, setTransitioning] = useState<boolean | null>(null);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [owner_status, setOwnerStatus] = useState<boolean | null>(null);
  const [post, setPost] = useState<string | null>(null);
  const [isPostShown, setIsPostShown] = useState<boolean>(false);
  const [currentPostDetails, setCurrentPostDetails] = useState<ProfilePostDetailsType | null>(null);
  const [post_list, setPostList] = useState<Array<PostListType> | null>(null);
  const [isFetchLimitReached, setIsFetchlimitReached] = useState<boolean | null>(true);
  const [settingOverviewPopup, setSettingsOverviewPopup] = useState<boolean>(false);
  const [requestCount, setRequestCount] = useState<number>(0);
  const FileInputRef = useRef<HTMLInputElement>(null);
  // all the hooks in react-router-dom causes re-render so React.memo() won't work in this case scenario
  // intead use useMemo() for heavy render calculations;
  // so this is my own custom hook with window.location
  const params = useProfileParams();

  // apollo-client;
  const [GetProfileData] = useLazyQuery(ProfileDataFetch, {
    onCompleted: (data) => {
      const { GetProfileData }: { GetProfileData: GetProfileDataProps } = data;
      if (GetProfileData.Error !== true) {
        const { PostData } = GetProfileData;
        if (
          GetProfileData.Verified === false ||
          GetProfileData.Verified === null
        ) {
          const serialized_post_list = SerializeNewPosts(PostData, post_list);
          const SerializedData = SerializeProfileData(GetProfileData, DefaultProfile);
          setOwnerStatus(false);
          setProfileInfo(SerializedData);
          setPostList(serialized_post_list);
        } else {
          if (GetProfileData.Verified === true) setOwnerStatus(true);
          const serialized_post_list = SerializeNewPosts(PostData, post_list);
          setPostList(serialized_post_list);
        }
        setIsFetchlimitReached(GetProfileData.Posts.length < 7);
        setRequestCount(requestCount + 1);
      }
    },
  });

  const [FetchMorePostData] = useLazyQuery(FetchMoreProfilePosts, {
    onCompleted: (data) => {
      const {GetMoreProfilePosts}: { GetMoreProfilePosts: GetProfileDataProps | null } = data;
      if (GetMoreProfilePosts) {
        if (GetMoreProfilePosts.Error !== true) {
          const { PostData } = GetMoreProfilePosts;
          const serialized_post_list = SerializeNewPosts(PostData, post_list);
          const fetchLimitReachedStatus = DetermineFetchLimit(profile_info.ProfileData?.Posts, requestCount);
          setIsFetchlimitReached(fetchLimitReachedStatus);
          setRequestCount(requestCount + 1);
          setPostList(serialized_post_list);
        }
      }
    },
  });

  const [MutatePost] = useMutation(AddPost, {
    onCompleted: (data) => {
      const { AddPost }: { AddPost: PostListType } = data;
      if (post_list) {
        const dummy = [...post_list];
        dummy.unshift(AddPost);
        setPostList(dummy);
      }
      setTransitioning(false);
      setPost(null);
    },
  });

  const [ChangeProfilePicture] = useMutation(MutateProfilePicture, {
    onCompleted: (_) => {
      if (post) {
        AddProfilePictureGlobally(post);
        setProfileInfo({ ...profile_info, ProfilePicture: post });
      }
      setTransitioning(false);
      setPost(null);
    },
  });

  // render functions
  const SendSocketRequest = useCallback((id: string | undefined) => {
    if (id && socket && userInfo) {
      socket.emit("send-request", userInfo.userID, id, userInfo.username);
    }
  }, [userInfo, socket]);

  const UploadImage = useCallback(() => {
    if (post && uploadType) {
      if (post.length > 0) {
        if (uploadType === "profile") {
          ChangeProfilePicture({
            variables: {
              auth_token: userInfo?.auth_token,
              uid: userInfo?.uid,
              id: userInfo?.userID,
              ProfilePicture: post,
            },
          });
        } else {
          MutatePost({
            variables: {
              auth_token: userInfo?.auth_token,
              uid: userInfo?.uid,
              id: userInfo?.userID,
              Caption: "",
              Post: post,
              Username: userInfo?.username,
            },
          });
        }
      }
    } else {
      alert("Please select a image to continue !!");
    }
  }, [post, MutatePost, userInfo, uploadType, ChangeProfilePicture]);

  const FetchImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      // @ts-ignore
      const compressed_image: string = await resizeFile(image);
      setPost(compressed_image);
    }
  };

  const ExitPopup = () => setTransitioning(false);

  const AddPostHandler = (type: string) => {
    setTransitioning(true);
    setUploadType(type);
    if (FileInputRef.current) {
      FileInputRef.current.click();
    }
  };

  const SettingsPressedHandler = () => {
    setSettingsOverviewPopup(!settingOverviewPopup);
  };

  const GetMorePostInfo = (config: ProfilePostDetailsType) => {
    setCurrentPostDetails(config);
    setIsPostShown(true);
  };
  const ChangeProfileHandler = () => {};

  const FetchMorePosts = () => {
    if (profile_info.ProfileData?.Posts && isFetchLimitReached === false) {
      setIsFetchlimitReached(null);
      let DummyPost = [...profile_info.ProfileData?.Posts];
      if (DummyPost.length > 6) {
        DummyPost = GetNewSlicedProfileData(DummyPost, requestCount);
        FetchMorePostData({
          variables: {
            auth_token: userInfo?.auth_token,
            id: userInfo?.userID,
            uid: userInfo?.uid,
            Posts: DummyPost,
          },
        });
      }
    }
  };

  const LogoutHandler = () => {
    ChangeAuthentication(false);
  };

  const RevertProfilePostDetails = () => {
    setCurrentPostDetails(null);
    setIsPostShown(false);
  };

  useEffect(
    () => {
      if (params && userInfo) {
        const ProfileDataCaller = (type: boolean) => {
          GetProfileData({
            variables: {
              auth_token: userInfo.auth_token,
              id: userInfo.userID,
              uid: userInfo.uid,
              searchID: params.id,
              verify: type,
              Posts: ProfileData?.Posts,
            },
          });
        };
        if (parseInt(params.owned) === 1 && params.id === userInfo.userID) {
          setOwnerStatus(true);
          ProfileDataCaller(true);
        } else {
          ProfileDataCaller(false);
        }
      }
    }, // eslint-disable-next-line
    [params]
  );

  const type = useMemo(() => {
    if (ProfileData?.Following) {
      if (ProfileData.Following.length > 0) {
        const requiredData = ProfileData.Following.filter((data) => {
          return data === params?.id;
        });
        if (requiredData.length > 0) return "Following";
        return "Follow";
      }
      return "Follow";
    }
    if (Requested) {
      if (Requested.length > 0) {
        const requiredData = Requested.filter((data) => {
          return data === params?.id;
        });
        if (requiredData.length > 0) {
          return "Requested";
        }
        return "Follow";
      }
      return "Follow";
    }
    return "Loading";
  }, [ProfileData?.Following, params, Requested]);

  const PostArea = useMemo(
    () => {
      if (post_list) {
        if (post_list.length > 0) {
          return (
            <React.Fragment>
              <ProfilePostAreaContainer>
                <ProfilePostArea>
                  {post_list.map((posts) => {
                    const isPostLiked = GetPostLikeStatus(ProfileData, posts);
                    return (
                      <ProfilePostOverview
                        Click={GetMorePostInfo}
                        key={posts._id}
                        source={posts.Post}
                        id={posts._id}
                        LikeStatus={isPostLiked}
                        CreatorID={posts.CreatorID}
                        CreatorUsername={posts.CreatorUsername}
                        Caption={posts.Caption}
                        Likes={posts.Likes}
                        UserInfo={userInfo}
                        ProfilePicture={profile_info.ProfilePicture}
                      />
                    );
                  })}
                </ProfilePostArea>
              </ProfilePostAreaContainer>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <ProfilePostAreaContainer>
              <h3>Sorry no Posts</h3>
            </ProfilePostAreaContainer>
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          <ProfilePostAreaContainer>
            <Spinner />
          </ProfilePostAreaContainer>
        </React.Fragment>
      );
    }, // eslint-disable-next-line 
    [post_list]
  );

  if (owner_status === null) {
    return (
      <React.Fragment>
        <MainPageContainer>
          <Spinner />
        </MainPageContainer>
      </React.Fragment>
    );
  }

  let Configuration = () => <React.Fragment></React.Fragment>;
  if (owner_status === true) {
    Configuration = () => {
      return (
        <ProfileConfigurationContainer>
          <ConfigLogoContainer click={ChangeProfileHandler}>
            <Logo>
              <AiOutlineProfile />
            </Logo>
          </ConfigLogoContainer>
          <ConfigLogoContainer click={AddPostHandler}>
            <Logo>
              <AiOutlinePlus />
            </Logo>
          </ConfigLogoContainer>
          <ConfigLogoContainer click={SettingsPressedHandler}>
            <Logo>
              <BiCog />
            </Logo>
          </ConfigLogoContainer>
          {settingOverviewPopup && (
            <SettingsOverViewPopup hoverOut={SettingsPressedHandler}>
              <SettingsOverViewElement name="Logout" press={LogoutHandler} />
            </SettingsOverViewPopup>
          )}
        </ProfileConfigurationContainer>
      );
    };
  }

  let POPUP = null;
  if (transitioning !== null) {
    POPUP = (
      <Transition
        in={transitioning}
        timeout={{
          enter: transition_duration,
          exit: transition_duration,
        }}
        unmountOnExit
        mountOnEnter
      >
        {(status) => {
          return (
            <AsyncBigPopupContainer
              ID={`popup-container-${status}`}
              status={status}
            >
              <PopupHeader Exit={ExitPopup} name="Add new Photo" />
              <PopupImageContainer
                Click={() => {
                  if (FileInputRef.current) {
                    FileInputRef.current.click();
                  }
                }}
                source={post}
              />
              <ImageSelector
                backgroundColor="#ff385c"
                name="Upload Image"
                Click={UploadImage}
              />
            </AsyncBigPopupContainer>
          );
        }}
      </Transition>
    );
  }

  let DetailedPosts = null;
  if (isPostShown && currentPostDetails) {
    DetailedPosts = (
      <AsyncDetailedPostContainer
        CreatorID={currentPostDetails.CreatorID}
        Caption={currentPostDetails.Caption}
        CreatorUsername={currentPostDetails.CreatorUsername}
        Likes={currentPostDetails.Likes}
        id={currentPostDetails.id}
        Post={currentPostDetails.Post}
        LikeStatus={currentPostDetails.LikeStatus}
        ProfilePicture={profile_info.ProfilePicture}
        UserInfo={userInfo}
        RevertPopup={RevertProfilePostDetails}
        ChangeLikedPosts={ChangeLikedPosts}
      />
    );
  }

  return (
    <React.Fragment>
      {POPUP}
      {DetailedPosts}
      <input type="file" hidden onChange={FetchImages} ref={FileInputRef} />
      <MainPageContainer popup={transitioning} Exit={ExitPopup}>
        <ProfileHeaderContainer>
          <ProfileHeaderImageContainer
            Click={owner_status ? AddPostHandler : undefined}
            source={profile_info.ProfilePicture}
            ownerStatus={owner_status}
          />
          <ProfileInformationOverView>
            <ProfileHeaderInfo
              name="Followers"
              value={profile_info.ProfileData?.Followers?.length}
            />
            <ProfileHeaderInfo
              name="Following"
              value={profile_info.ProfileData?.Following?.length}
            />
            <ProfileHeaderInfo
              name="Posts"
              value={profile_info.ProfileData?.Posts.length}
            />
          </ProfileInformationOverView>
          {owner_status === false && (
            <ProfileStateButton
              userInfo={userInfo}
              RequesterUsername={profile_info.ProfileData?.Username}
              RequesterID={params?.id}
              name={type}
              SendSocketRequest={SendSocketRequest}
            />
          )}
        </ProfileHeaderContainer>
        <Configuration />
        {PostArea}
        {isFetchLimitReached === null ? (
          <Spinner />
        ) : isFetchLimitReached === true ? null : (
          <Paginate color="rgb(242, 242, 242)" Click={FetchMorePosts} />
        )}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(ProfileContainer);