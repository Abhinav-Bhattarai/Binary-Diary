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
import {
  BigPopupContainer,
  ImageSelector,
  MainPageContainer,
} from "../Reusables/reusables";
import { PopupHeader, PopupImageContainer } from "../Reusables/reusables";
import { contextData } from "../../../Container/MainPage/Context";
import { FetchMoreProfilePosts, ProfileDataFetch } from "../../../GraphQL/gql";
import {
  GetProfileDataProps,
  PostListType,
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
} from "./reusables";
import { AddPost } from "../../../GraphQL/mutations";
import { UserData, UserInfo } from "../../../Container/MainPage/interfaces";
import useProfileParams from "../../../Hooks/profileHook";

const transition_duration: number = 500;

interface PROPS {
  ChangeAuthentication: (type: boolean) => void;
  userInfo: UserInfo | null;
  ProfilePicture: string;
  ProfileData: UserData | null;
};

const ProfileContainer: React.FC<PROPS> = (props) => {
  const { ChangeAuthentication, userInfo, ProfilePicture, ProfileData } = props;
  const [profile_info, setProfileInfo] = useState<
    contextData | SerializedProfile
  >({
    ProfilePicture,
    ProfileData,
    userInfo
  });
  const [transitioning, setTransitioning] = useState<boolean | null>(null);
  const [owner_status, setOwnerStatus] = useState<boolean | null>(null);
  const [post, setPost] = useState<string | null>(null);
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
  // so this is my own custom hook
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

  const FetchImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      // @ts-ignore
      const compressed_image: string = await resizeFile(image);
      setPost(compressed_image);
    }
  };

  const ExitPopup = () => setTransitioning(false);

  const AddPostHandler = () => {
    setTransitioning(true);
    if (FileInputRef.current) {
      FileInputRef.current.click();
    }
  };

  const SettingsPressedHandler = () => {
    setSettingsOverviewPopup(!settingOverviewPopup);
  };

  const ChangeProfileHandler = () => {};

  const UploadImage = useCallback(() => {
    if (post) {
      if (post.length > 0) {
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
    } else {
      alert("Please select a image to continue !!");
    }
  }, [post, MutatePost, userInfo]);

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
      if (
        parseInt(params.owned) === 1 &&
        params.id === userInfo?.userID
      ) {
        setOwnerStatus(true);
        ProfileDataCaller(true);
      } else {
        ProfileDataCaller(false);
      }
    }
    }, // eslint-disable-next-line
    [params]
  );

  const POPUP = useMemo(() => {
    if (transitioning !== null) {
      return (
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
              <BigPopupContainer
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
              </BigPopupContainer>
            );
          }}
        </Transition>
      );
    }
  }, [transitioning, UploadImage, post]);

  const GetMoreInformationAboutPostData = useCallback(
    (id: string) => {
      if (post_list) {
        if (post_list.length > 0) {
          const Required_index = post_list.findIndex(
            (value) => value._id === id
          );
          if (Required_index !== -1) {
            // add the required post object in a more_post_info state;
          }
        }
      }
    },
    [post_list]
  );

  const LogoutHandler = () => {
    ChangeAuthentication(false);
  };

  const PostArea = useMemo(() => {
    if (post_list) {
      if (post_list.length > 0) {
        return (
          <React.Fragment>
            <ProfilePostAreaContainer>
              <ProfilePostArea>
                {post_list.map((posts) => {
                  return (
                    <ProfilePostOverview
                      key={posts._id}
                      source={posts.Post}
                      Click={GetMoreInformationAboutPostData}
                      id={posts._id}
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
  }, [post_list, GetMoreInformationAboutPostData]);

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

  return (
    <React.Fragment>
      {POPUP}
      <input type="file" hidden onChange={FetchImages} ref={FileInputRef} />
      <MainPageContainer popup={transitioning} Exit={ExitPopup}>
        <ProfileHeaderContainer>
          <ProfileHeaderImageContainer source={profile_info.ProfilePicture} />
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
        </ProfileHeaderContainer>
        <Configuration />
        {PostArea}
        {isFetchLimitReached === null ? (
          <Spinner />
        ) : isFetchLimitReached === true ? null : (
          <div id="add-logo-container" onClick={FetchMorePosts}>
            <Logo>
              <AiOutlinePlus />
            </Logo>
          </div>
        )}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(ProfileContainer);