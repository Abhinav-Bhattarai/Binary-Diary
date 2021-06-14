import React, { useState, useMemo, useRef } from "react";
import { BigPopupContainer, MainPageContainer } from "../Reusables/reusables";
import { Transition } from "react-transition-group";
import Resizer from "react-image-file-resizer";
import { PopupHeader, PopupImageContainer } from "../Reusables/reusables";
const transition_duration: number = 4000;

const resizeFile = async (file: Blob) => {
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      90,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64",
      300,
      300
    );
  });
};

const ProfileContainer = () => {
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [post, setPost] = useState<string | null>(null);
  const FileInputRef = useRef<HTMLInputElement>(null);

  const FetchImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      // @ts-ignore
      const compressed_image: string = await resizeFile(image);
      setPost(compressed_image);
    }
  };

  const ExitPopup = () => setTransitioning(false);

  const POPUP = useMemo(() => {
    if (transitioning) {
      return (
        <Transition
          in={transitioning}
          mountOnEnter
          unmountOnExit
          timeout={transition_duration}
        >
          <BigPopupContainer>
            <PopupHeader Exit={ExitPopup} name="Add new Photo" />
            <input
              type="text"
              hidden
              onChange={FetchImages}
              ref={FileInputRef}
            />
            <PopupImageContainer source={post} />
          </BigPopupContainer>
        </Transition>
      );
    }
    return null;
  }, [transitioning, post]);

  return (
    <React.Fragment>
      {POPUP}
      <MainPageContainer popup={transitioning} Exit={ExitPopup}>
        <h1>ProfileContainer</h1>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default ProfileContainer;