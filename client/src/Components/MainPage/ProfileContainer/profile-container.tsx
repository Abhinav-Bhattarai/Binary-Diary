import React, {
  useState,
  useMemo,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Transition } from "react-transition-group";
import { useParams } from "react-router-dom";
import { AiOutlinePlus, AiOutlineProfile } from "react-icons/ai";
import { BiCog } from "react-icons/bi";
import { useLazyQuery } from "@apollo/client";

import "./profile-container.scss";
import {
  BigPopupContainer,
  ImageSelector,
  MainPageContainer,
} from "../Reusables/reusables";
import { PopupHeader, PopupImageContainer } from "../Reusables/reusables";
import { Context, contextData } from "../../../Container/MainPage/Context";
import { ProfileData } from "../../../GraphQL/gql";
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
} from "./reusables";

const transition_duration: number = 500;

const ProfileContainer = () => {
  const context = useContext(Context);
  const [profile_info, setProfileInfo] =
    useState<contextData | SerializedProfile>(context);
  const [transitioning, setTransitioning] = useState<boolean | null>(null);
  const [owner_status, setOwnerStatus] = useState<boolean | null>(null);
  const [post, setPost] = useState<string | null>(null);
  const [post_list, setPostList] = useState<Array<PostListType> | null>(null);
  const FileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ id: string; owned: string }>();

  // apollo-client;
  const [GetProfileData] = useLazyQuery(ProfileData, {
    onCompleted: (data) => {
      const { GetProfileData }: { GetProfileData: GetProfileDataProps } = data;
      if (GetProfileData) {
        const { PostData } = GetProfileData;
        if (
          GetProfileData.Verified === false ||
          GetProfileData.Verified === null
        ) {
          setOwnerStatus(false);
          setPostList(PostData);
          const SerializedData = SerializeProfileData(
            GetProfileData,
            DefaultProfile
          );
          setProfileInfo(SerializedData);
        } else {
          setPostList(GetProfileData.PostData);
        }
      }
    },
    onError: (error) => console.log(error),
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

  const SettingsPressedHandler = () => {};

  const ChangeProfileHandler = () => {};

  const UploadImage = useCallback(() => {
    if (post) {
      if (post.length > 0) {

      } 
    } else {
      alert('Please select a image to continue !!');
    }
  }, [post]);

  useEffect(
    () => {
      const ProfileDataCaller = (type: boolean) => {
        GetProfileData({
          variables: {
            auth_token: context.userInfo?.auth_token,
            id: context.userInfo?.userID,
            uid: context.userInfo?.uid,
            searchID: params.id,
            verify: type,
            Posts: context.ProfileData?.Posts,
          },
        });
      };
      if (
        parseInt(params.owned) === 1 &&
        params.id === context.userInfo?.userID
      ) {
        setOwnerStatus(true);
        ProfileDataCaller(true);
      } else {
        ProfileDataCaller(false);
      }
    }, // eslint-disable-next-line
    []
  );
  
  const POPUP = useMemo(() => {
    if (transitioning !== null) {
      console.log(transitioning);
      return (
        <Transition
          in={transitioning}
          timeout={{
            enter: transition_duration,
            exit: transition_duration
          }}
          unmountOnExit
          mountOnEnter
        >
          {(status) => {
            console.log(`popup-container-${status}`);
            return (
              <BigPopupContainer ID={`popup-container-${status}`} status={status}>
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
  }, [transitioning, UploadImage, post])

  const GetMorePostData = useCallback(
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
                      Click={GetMorePostData}
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
  }, [post_list, GetMorePostData]);

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
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(ProfileContainer);
