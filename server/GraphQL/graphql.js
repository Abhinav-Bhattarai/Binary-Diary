import redis from "async-redis";
import { createRequire } from "module";
import { ByPassChecking } from "../Middleware/mutation-checker.js";
import RequestModel from "../Models/RequestModel.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");

import {
  AddNewComment,
  AddPostID,
  AddPostToDatabase,
  AddToFollowersList,
  AddToFollowingList,
  AddToRequestedList,
  AddToRequestsList,
  AddToUserCacheForLikedPosts,
  RegisterLikeInPostSchema,
  RegisterLikeInRegisterSchema,
  RemoveFromFollowersList,
  RemoveFromFollowingList,
  RemoveLikeInPostSchema,
  RemoveLikeInRegisterSchema,
  RemoveUserCacheForLikedPosts,
  UpdateCacheUserInfo,
  UpdateRequestList,
  AddProfilePictureToPpCacheLayer,
  AddProfilePictureToUserInfoCacheLayer,
  AddProfilePictureToDB,
  AddToRequestedListCacheLayer,
  RemoveFromRequestedList,
  RemoveFromRequestsList,
  RemoveFromRequestedListCache,
} from "./MutationHelper.js";
import {
  GetPostComments,
  GetPostDataHandler,
  GetUserDataCacheCheck,
  FetchUserData,
  FollowingDataSearch,
  ProfilePostCollector
} from "./QueryHelper.js";

const cache = redis.createClient();

const PostSchema = new GraphQLObjectType({
  name: "PostSchema",
  fields: () => {
    return {
      _id: { type: GraphQLString },
      Post: { type: GraphQLString },
      Caption: { type: GraphQLString },
      PostDate: { type: GraphQLString },
      CreatorID: { type: GraphQLString },
      CreatorUsername: { type: GraphQLString },
      Likes: { type: new GraphQLList(GraphQLString) },
      ProfilePicture: { type: GraphQLString },
      Mutated: { type: GraphQLBoolean },
      Error: {type: GraphQLBoolean}
    };
  },
});

const ProfileSchema = new GraphQLObjectType({
  name: "ProfileObject",
  fields: () => {
    return {
      Username: { type: GraphQLString },
      Posts: { type: new GraphQLList(GraphQLString) },
      Followers: { type: new GraphQLList(GraphQLString) },
      Following: { type: new GraphQLList(GraphQLString) },
      Verified: { type: GraphQLBoolean },
      ProfilePicture: { type: GraphQLString },
      PostData: {
        type: new GraphQLList(PostSchema),
        resolve: async (parent, _) => {
          const { Posts } = parent;
          const PostData = await ProfilePostCollector(Posts, cache);
          return PostData;
        },
      },
      Mutated: { type: GraphQLBoolean },
      Error: {type: GraphQLBoolean}
    };
  },
});

const UserSchema = new GraphQLObjectType({
  name: "UserSchema",
  fields: () => {
    return {
      Username: { type: GraphQLString },
      ProfilePicture: { type: GraphQLString },
      Bio: { type: GraphQLString },
      Followers: { type: new GraphQLList(GraphQLString) },
      Following: { type: new GraphQLList(GraphQLString) },
      LikedPosts: { type: new GraphQLList(GraphQLString) },
      Posts: { type: new GraphQLList(GraphQLString) },
      Mutated: { type: GraphQLBoolean },
      Requested: { type: new GraphQLList(GraphQLString) },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async (parent, _) => {
          const { Following } = parent;
          if (Following.length > 0) {
            const response = await FollowingDataSearch(Following);
            return response;
          }
          return [];
        },
      },
      Error: {type: GraphQLBoolean}
    };
  },
});

const RequestSchemaRequests = new GraphQLObjectType({
  name: "RequestSchemaRequest",
  fields: () => {
    return {
      extenderID: { type: GraphQLString },
      ProfilePicture: { type: GraphQLString },
      Username: { type: GraphQLString },
    };
  },
});

const RequestSchema = new GraphQLObjectType({
  name: "RequestSchema",
  fields: () => {
    return {
      UserID: { type: GraphQLString },
      Mutated: { type: GraphQLBoolean },
      Requests: {
        type: new GraphQLList(RequestSchemaRequests),
        resolve: async (parent, _) => {
          const { Requests } = parent;
          if (Requests.length > 0) {
            for (let request of Requests) {
              const ProfilePicture = await cache.get(
                `ProfilePicture/${parent.UserID}`
              );
              request.ProfilePicture = ProfilePicture ? ProfilePicture : "";
            }
            return Requests;
          }
          return Requests;
        },
      },
      Error: {type: GraphQLBoolean}
    };
  },
});

const CommentSchema = new GraphQLObjectType({
  name: "CommentSchema",
  fields: () => {
    return {
      PostID: {
        type: GraphQLString,
      },

      Comment: {
        type: GraphQLString,
      },

      CommenterID: {
        type: GraphQLString,
      },

      CommenterUsername: {
        type: GraphQLString,
      },

      _id: {
        type: GraphQLString,
      },

      ProfilePicture: {
        type: GraphQLString,
      },

      Mutated: {
        type: GraphQLBoolean,
      },

      Error: {
        type: GraphQLBoolean,
      },
    };
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetUserData: {
      type: UserSchema,
      args: {
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, uid, auth_token } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          const response = await GetUserDataCacheCheck(cache, id, uid);
          return response;
        }
      },
    },

    GetPostsData: {
      type: new GraphQLList(PostSchema),
      args: {
        auth_token: { type: GraphQLString },
        Posts: { type: new GraphQLList(GraphQLString) },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { auth_token, Posts, id, uid } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          const response = await GetPostDataHandler(cache, Posts);
          return response;
        }
      },
    },

    GetPostComments: {
      type: new GraphQLList(CommentSchema),
      args: {
        auth_token: { type: GraphQLString },
        PostID: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        requestCount: { type: GraphQLInt },
      },
      resolve: async (_, args) => {
        const { auth_token, PostID, id, uid, requestCount } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          const response = await GetPostComments(PostID, requestCount, cache);
          return response;
        }
      },
    },

    GetProfileData: {
      type: ProfileSchema,
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        searchID: { type: GraphQLString },
        verify: { type: GraphQLBoolean },
        Posts: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (_, args) => {
        const { auth_token, id, uid, searchID, verify, Posts } = args;
        if (verify) {
          const verification = ByPassChecking(auth_token, searchID, uid);
          if (verification) {
            return { Posts, Verified: true };
          } else {
            const response = await FetchUserData(searchID);
            return response;
          }
        } else {
          const response = await FetchUserData(searchID);
          const verification = ByPassChecking(auth_token, searchID, uid);
          if (verification) {
            return { ...response, Verified: true };
          }
          return response;
        }
      },
    },

    GetMoreProfilePosts: {
      type: ProfileSchema,
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        Posts: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (_, args) => {
        const { auth_token, id, uid, Posts } = args;
        const verification = ByPassChecking(auth_token, id, uid);
        if (verification) {
          return { Posts };
        }
      },
    },

    GetProfileRequests: {
      type: RequestSchema,
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, auth_token, uid } = args;
        const verification = ByPassChecking(auth_token, id, uid);
        if (verification) {
          const response = await RequestModel.findOne({ UserID: id });
          if (response) {
            return { Requests: response.Requests, UserID: response.UserID };
          }
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    AddPost: {
      type: PostSchema,
      args: {
        id: { type: GraphQLString },
        Username: { type: GraphQLString },
        Post: { type: GraphQLString },
        Caption: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const validity = ByPassChecking(args.auth_token, args.id, args.uid);
        if (validity) {
          const db_response = await AddPostToDatabase(args);
          await UpdateCacheUserInfo(cache, db_response, args.id, args.uid);
          AddPostID(args.id, db_response._id);
          return {
            Mutated: true,
            Post: args.Post,
            _id: db_response._id,
            CreatorUsername: args.Username,
            CreatorID: args.id,
            Likes: [],
            Caption: "",
          };
        }
      },
    },

    MutatePostLike: {
      type: PostSchema,
      args: {
        id: { type: GraphQLString },
        Username: { type: GraphQLString },
        PostID: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
        type: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, uid, auth_token, PostID, type } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          if (type === "like") {
            RegisterLikeInPostSchema(id, PostID);
            RegisterLikeInRegisterSchema(id, PostID);
            await AddToUserCacheForLikedPosts(cache, id, uid, PostID);
          } else {
            RemoveLikeInPostSchema(id, PostID);
            RemoveLikeInRegisterSchema(id, PostID);
            await RemoveUserCacheForLikedPosts(cache, id, uid, PostID);
          }
          return { Mutated: true };
        }
      },
    },

    MutateFollowRequests: {
      type: RequestSchema,
      args: {
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
        type: { type: GraphQLString },
        RequesterID: { type: GraphQLString },
        username: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, uid, auth_token, type, RequesterID, username } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          if (type === "Follow") {
            AddToRequestsList(id, RequesterID, username);
            AddToRequestedList(RequesterID, id);
            AddToRequestedListCacheLayer(cache, RequesterID, id, uid)
          } else if (type === "Following") {
            RemoveFromFollowersList(id, RequesterID);
            RemoveFromFollowingList(RequesterID, id);
          } else if(type === 'Requested') {
            RemoveFromRequestedList(RequesterID, id)
            RemoveFromRequestsList(id, RequesterID);
            RemoveFromRequestedListCache(cache, RequesterID, id, uid);
          }

          return { Mutated: true };
        }
        return { Mutated: false };
      },
    },

    MutateRequestsResponse: {
      type: RequestSchema,
      args: {
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
        type: { type: GraphQLString },
        RequesterID: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, uid, auth_token, type, RequesterID } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          UpdateRequestList(id, RequesterID);
          if (type === "Add") {
            AddToFollowersList(cache, RequesterID, id);
            AddToFollowingList(cache, RequesterID, id);
          }
          return { Mutated: true };
        }
        return { Mutated: false };
      },
    },

    MutateComments: {
      type: CommentSchema,
      args: {
        auth_token: { type: GraphQLString },
        PostID: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        username: { type: GraphQLString },
        Comment: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { auth_token, PostID, id, uid, username, Comment } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          const config = {
            CommenterID: id,
            CommenterUsername: username,
            PostID,
            Comment,
          };
          AddNewComment(config);
          return { Mutated: true };
        }
        return { Mutated: false };
      },
    },

    MutateProfilePicture: {
      type: UserSchema,
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString },
        uid: { type: GraphQLString },
        ProfilePicture: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { auth_token, ProfilePicture, id, uid } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          AddProfilePictureToPpCacheLayer(cache, ProfilePicture, id);
          AddProfilePictureToUserInfoCacheLayer(cache, ProfilePicture, id, uid);
          AddProfilePictureToDB(ProfilePicture, id);
          return { Mutated: true };
        }
      },
    },
  },
});

const MainSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default MainSchema;
