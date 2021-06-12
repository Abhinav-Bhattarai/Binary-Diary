import React, { useRef, useState } from "react";
import { BigPopupContainer, PopupHeader, PopupImageContainer } from "../Reusables/reusables";
import Resizer from "react-image-file-resizer";

const resizeFile = async(file: Blob) => {
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

const PostPopup = () => {
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

  return (
    <React.Fragment>
      <BigPopupContainer>
        <PopupHeader name='Add a Post !'/>
        <input type="file" hidden onChange={FetchImages} ref={FileInputRef} />
        <PopupImageContainer source={post}/>
      </BigPopupContainer>
    </React.Fragment>

  );
};

export default PostPopup;