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
import { resizeFile, SerializeProfileData } from "./helper";
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

const transition_duration: number = 500;

interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
  userInfo: UserInfo | null;
  ProfilePicture: string;
  ProfileData: UserData | null;
  Requested: Array<string> | null;
  ChangeLikedPosts: (type: boolean, id: string) => void;
  SendSocketRequest: (id: string | undefined) => void;
}

const AsyncBigPopupContainer = React.lazy(
  () => import("../Reusables/reusables")
);

const AsyncDetailedPostContainer = React.lazy(() => import("./reusables"));

const ProfileContainer: React.FC<PROPS> = (props) => {
  const {
    ChangeAuthentication,
    userInfo,
    ProfilePicture,
    ProfileData,
    Requested,
    ChangeLikedPosts,
    SendSocketRequest,
  } = props;
  const [profile_info, setProfileInfo] = useState<
    contextData | SerializedProfile
  >({
    ProfilePicture,
    ProfileData,
    userInfo,
  });
  const [transitioning, setTransitioning] = useState<boolean | null>(null);
  const [uploadType, setUploadType] = useState<string | null>(null);
  const [owner_status, setOwnerStatus] = useState<boolean | null>(null);
  const [post, setPost] = useState<string | null>(null);
  const [isPostShown, setIsPostShown] = useState<boolean>(false);
  const [currentPostDetails, setCurrentPostDetails] =
    useState<ProfilePostDetailsType | null>(null);
  const [post_list, setPostList] = useState<Array<PostListType> | null>(null);
  const [isFetchLimitReached, setIsFetchlimitReached] = useState<
    boolean | null
  >(true);
  const [settingOverviewPopup, setSettingsOverviewPopup] =
    useState<boolean>(false);
  const [request_count, setRequestCount] = useState<number>(0);
  const FileInputRef = useRef<HTMLInputElement>(null);
  // all the hooks in react-router-dom causes re-render so React.memo() won't work in this case scenario
  // intead use useMemo() for heavy render calculations;
  // so this is my own custom hook with window.location
  const params = useProfileParams();
  // apollo-client-helper
  const SerializeNewPosts = (PostData: Array<PostListType>) => {
    let serialized_post_list = PostData;
    if (!PostData) return [];
    if (post_list && PostData.length > 0) {
      serialized_post_list = [...post_list];
      for (let post of PostData) {
        serialized_post_list.push(post);
      }
    }
    return serialized_post_list;
  };

  // apollo-client;
  const [GetProfileData] = useLazyQuery(ProfileDataFetch, {
    onCompleted: (data) => {
      const { GetProfileData }: { GetProfileData: GetProfileDataProps } = data;
      if (GetProfileData) {
        const { PostData } = GetProfileData;
        if (
          GetProfileData.Verified === false ||
          GetProfileData.Verified === null
        ) {
          setOwnerStatus(false);
          const serialized_post_list = SerializeNewPosts(PostData);
          const SerializedData = SerializeProfileData(
            GetProfileData,
            DefaultProfile
          );
          setProfileInfo(SerializedData);
          setPostList(serialized_post_list);
        } else {
          if (GetProfileData.Verified === true) setOwnerStatus(true);
          const serialized_post_list = SerializeNewPosts(PostData);
          setPostList(serialized_post_list);
        }
        setIsFetchlimitReached(GetProfileData.Posts.length < 7);
        setRequestCount(request_count + 1);
      }
    },
  });

  const [FetchMorePostData] = useLazyQuery(FetchMoreProfilePosts, {
    onCompleted: (data) => {
      const {
        GetMoreProfilePosts,
      }: { GetMoreProfilePosts: GetProfileDataProps } = data;
      if (GetMoreProfilePosts) {
        const { PostData } = GetMoreProfilePosts;
        const serialized_post_list = SerializeNewPosts(PostData);
        setIsFetchlimitReached(PostData.length < 7);
        setRequestCount(request_count + 1);
        setPostList(serialized_post_list);
      }
    },
  });

  const [MutatePost] = useMutation(AddPost, {
    onCompleted: (_) => {
      setTransitioning(false);
      setPost(null);
    },
  });

  const [ChangeProfilePicture] = useMutation(MutateProfilePicture, {
    onCompleted: (_) => {
      setTransitioning(false);
      setPost(null);
    },
  });

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

  const FetchMorePosts = () => {
    if (profile_info.ProfileData?.Posts && isFetchLimitReached === false) {
      setIsFetchlimitReached(null);
      let DummyPost = [...profile_info.ProfileData?.Posts];
      if (DummyPost.length > 6) {
        let last_index = DummyPost.length;
        if (DummyPost.length - 1 > (request_count + 1) * 6) {
          last_index = (request_count + 1) * 6;
        }
        DummyPost = DummyPost.slice(request_count * 6, last_index);
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

  useEffect(
    () => {
      if (params) {
        const ProfileDataCaller = (type: boolean) => {
          GetProfileData({
            variables: {
              auth_token: userInfo?.auth_token,
              id: userInfo?.userID,
              uid: userInfo?.uid,
              searchID: params.id,
              verify: type,
              Posts: ProfileData?.Posts,
            },
          });
        };
        if (parseInt(params.owned) === 1 && params.id === userInfo?.userID) {
          setOwnerStatus(true);
          ProfileDataCaller(true);
        } else {
          ProfileDataCaller(false);
        }
      }
    }, // eslint-disable-next-line
    [params]
  );

  const LogoutHandler = () => {
    ChangeAuthentication(false);
  };

  const RevertProfilePostDetails = () => {
    setCurrentPostDetails(null);
    setIsPostShown(false);
  };

  const type = useMemo(() => {
    if (ProfileData?.Following) {
      if (ProfileData.Following.length > 0) {
        const requiredData = ProfileData.Following.filter((data) => {
          return data === params?.id;
        });
        if (requiredData.length > 0) {
          return "Following";
        }
        return "Follow";
      }
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
  }, [ProfileData?.Following, params?.id, Requested]);

  const PostArea = useMemo(
    () => {
      console.log("went");
      if (post_list) {
        if (post_list.length > 0) {
          return (
            <React.Fragment>
              <ProfilePostAreaContainer>
                <ProfilePostArea>
                  {post_list.map((posts) => {
                    let isPostLiked = false;
                    if (ProfileData?.LikedPosts) {
                      if (ProfileData.LikedPosts.length > 0) {
                        for (let id of ProfileData.LikedPosts) {
                          if (posts._id === id) {
                            isPostLiked = true;
                            break;
                          }
                        }
                      }
                    }
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
    },
    // eslint-disable-next-line
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
          <Paginate color='rgb(242, 242, 242)' Click={FetchMorePosts}/>
        )}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(ProfileContainer);
