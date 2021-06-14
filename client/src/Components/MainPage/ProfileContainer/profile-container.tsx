import React, { useState, useMemo, useRef, useContext } from "react";
import { BigPopupContainer, MainPageContainer } from "../Reusables/reusables";
import { Transition } from "react-transition-group";
import { PopupHeader, PopupImageContainer } from "../Reusables/reusables";
import { Context, contextData } from "../../../Container/MainPage/Context";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { resizeFile } from "./helper";
import "./profile-container.scss";
const transition_duration: number = 4000;

const ProfileHeaderImageContainer: React.FC<{ source: string }> = ({
  source,
}) => {
  return (
    <div id="profile-img-container">
      <img src={source} width="200px" height="200px" alt="profile-pic" />
    </div>
  );
};

const ProfileHeaderContainer: React.FC<{}> = ({ children }) => {
  return <header id="profile-header-container">{children}</header>;
};

const ProfileHeaderInfo: React.FC<{
  name: string;
  value: string | number | undefined;
}> = (props) => {
  const { name, value } = props;
  return (
    <main id="profile-overview-container">
      <div className="overview">{name}</div>
      <div className="overview">{value}</div>
    </main>
  );
};

const ProfileInformationOverView: React.FC<{}> = ({ children }) => {
  return <main id="profile-information-overview">{children}</main>;
};

const ProfileContainer = () => {
  const context = useContext(Context);
  const [profile_info, setProfileInfo] = useState<contextData>(context);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [owner_status, setOwnerStatus] = useState<boolean | null>(null);
  const [post, setPost] = useState<string | null>(null);
  const FileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ id: string; owner: string }>();

  const FetchImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      // @ts-ignore
      const compressed_image: string = await resizeFile(image);
      setPost(compressed_image);
    }
  };

  const ExitPopup = () => setTransitioning(false);

  useEffect(
    () => {
      if (parseInt(params.owner) === 1 && params.id === context.userInfo?.userID) {
        setOwnerStatus(true);
      } else {
      }
    }, // eslint-disable-next-line
    []
  );

  const POPUP = useMemo(() => {
    if (transitioning) {
      return (
        <Transition
          in={transitioning}
          mountOnEnter
          unmountOnExit
          timeout={transition_duration}
        >
          {(status) => {
            console.log(status);
            return (
              <BigPopupContainer status={status}>
                <PopupHeader Exit={ExitPopup} name="Add new Photo" />
                <input
                  type="text"
                  hidden
                  onChange={FetchImages}
                  ref={FileInputRef}
                />
                <PopupImageContainer source={post} />
              </BigPopupContainer>
            );
          }}
        </Transition>
      );
    }
    return null;
  }, [transitioning, post]);

  // if (owner_status === null) {
  //   return <React.Fragment></React.Fragment>;
  // }

  return (
    <React.Fragment>
      {POPUP}
      <MainPageContainer popup={transitioning} Exit={ExitPopup}>
        <ProfileHeaderContainer>
          <ProfileHeaderImageContainer source={profile_info.ProfilePicture} />
          <ProfileInformationOverView>
            <ProfileHeaderInfo
              name="Followers"
              value={profile_info.ProfileData?.Followers.length}
            />
            <ProfileHeaderInfo
              name="Following"
              value={profile_info.ProfileData?.Following.length}
            />
            <ProfileHeaderInfo
              name="Posts"
              value={profile_info.ProfileData?.Posts.length}
            />
          </ProfileInformationOverView>
        </ProfileHeaderContainer>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default ProfileContainer;
