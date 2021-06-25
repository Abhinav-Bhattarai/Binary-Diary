import redis from "async-redis";
import { createRequire } from "module";
import { ByPassChecking } from "../Middleware/mutation-checker.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
} = require("graphql");

import {
  AddPostID,
  AddPostToDatabase,
  FetchUserData,
  FollowingDataSearch,
  GetPostDataHandler,
  GetUserDataCacheCheck,
  ProfilePostCollector,
  RegisterLikeInPostSchema,
  RegisterLikeInRegisterSchema,
  UpdateCacheUserInfo,
} from "./helper.js";

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
    };
  },
});

const ProfileSchema = new GraphQLObjectType({
  name: "ProfileObject",
  fields: () => {
    return {
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
      Mutated: { type: GraphQLBoolean }
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
      Mutated: { type: GraphQLBoolean }
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
          const verification = ByPassChecking(auth_token, id, uid);
          if (verification) {
            return { Posts, Verified: true };
          } else {
            const response = FetchUserData(searchID);
            return response;
          }
        } else {
          const response = await FetchUserData(searchID);
          const verification = ByPassChecking(auth_token, id, uid);
          if (verification) {
            return {...response, Verified: true};
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
          await AddPostID(args.id, db_response._id);
          return { Mutated: true };
        }
      },
    },

    LikePost: {
      type: PostSchema,
      args: {
        id: { type: GraphQLString },
        Username: { type: GraphQLString },
        PostID: { type: GraphQLString },
        uid: { type: GraphQLString },
        auth_token: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { id, uid, auth_token, Username, PostID } = args;
        const validity = ByPassChecking(auth_token, id, uid);
        if (validity) {
          await RegisterLikeInPostSchema(Username, id, PostID);
          await RegisterLikeInRegisterSchema(id, PostID);
          return {Mutated: true};
        }
      }
    }
  },
});

const MainSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default MainSchema;
