import Crypto from "crypto-js";

export function FlattenPost(posts, sort) {
  if (posts.length > 0) {
    const new_post = [];
    for (let post of posts) {
      if (sort === true) {
        const DAY = 60 * 60 * 24;
        const date_difference =
          (new Date() - new Date(post.CreationDate)) / 1000;
        if (date_difference <= DAY * 3) {
          new_post.push(post.PostID);
        }
      } else {
        new_post.push(post.PostID);
      }
    }
    return new_post;
  }
  return [];
}

export const SerializeComments = async (cache, arr) => {
  const SerializedData = [];
  for (let comment of arr) {
    const ProfilePicture = await cache.get(
      `ProfilePicture/${comment.CommenterID}`
    );
    comment.ProfilePicture = ProfilePicture ? ProfilePicture : "";
    SerializedData.push(comment);
  }
  return SerializedData;
};

export const Decrypt = (Encryption) => {
  const bytes = Crypto.AES.decrypt(
    Encryption,
    process.env.ENCRYPT_TOKEN
  ).toString(Crypto.enc.Utf8);
  return JSON.parse(bytes);
};

export const Encrypt = (Encryption) => {
  const bytes = Crypto.AES.encrypt(
    JSON.stringify(Encryption),
    process.env.ENCRYPT_TOKEN
  ).toString();
  return bytes;
};
