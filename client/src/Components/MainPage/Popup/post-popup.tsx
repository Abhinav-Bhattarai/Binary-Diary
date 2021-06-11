import React, { useRef, useState } from 'react';
import { BigPopupContainer } from '../Reusables/reusables';
import Resizer from 'react-image-file-resizer';

const resizeFile = (file: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      90,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

const PostPopup = () => {
    const [post, setPost] = useState<string | null | unknown>(null);
    const FileInputRef = useRef<HTMLInputElement>(null);

    const FetchImages = async(event: React.ChangeEvent<HTMLInputElement>) => {
        // if (event.target.files) {
        //     const image = event.target.files[0];
        //     const reader = new FileReader();
        //     reader.onload = () => {
        //         console.log('UncompressedImage');
        //         console.log(reader.result);
        //     };
        //     reader.readAsDataURL(image);
        // }
        if (event.target.files) {
            const image = event.target.files[0];
            const compressed_image: unknown = await resizeFile(image);
            setPost(compressed_image);
        }   
    }

    return (
        <React.Fragment>
            <BigPopupContainer>
                <input type='file' onChange={FetchImages} ref={FileInputRef}/>
            </BigPopupContainer>
        </React.Fragment>

    )
};

export default PostPopup;
