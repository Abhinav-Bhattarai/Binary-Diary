import Resizer from "react-image-file-resizer";

export const resizeFile = async (file: Blob) => {
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