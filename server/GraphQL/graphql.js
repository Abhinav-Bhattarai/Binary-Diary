import redis from "async-redis";
import { createRequire } from "module";
import { PostModel } from "../Models/post-model.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
} = require("graphql");

import {
  CheckJWT,
  FollowingDataSearch,
  GetUserDataCacheCheck,
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
      CreatorUsername: { type: GraphQLString }
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
      Posts: { type: new GraphQLList(GraphQLString) },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async (parent, _) => {
          const { Username, Following } = parent;
          const response = await FollowingDataSearch(
            cache,
            Following,
            Username
          );
          return response;
        },
      },
    };
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    GetUserData: {
      type: UserSchema,
      args: { id: { type: GraphQLString }, uid: { type: GraphQLString } },
      resolve: async (_, args) => {
        const { id, uid } = args;
        const response = GetUserDataCacheCheck(cache, id, uid);
        return response;
      },
    },

    GetPostsData: {
      type: PostSchema,
      args: {
        auth_token: { type: GraphQLString },
        posts: { type: new GraphQLList(GraphQLString) },
        request_count: { type: GraphQLInt },
        id: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { auth_token, posts, id, request_count } = args;
        const data = CheckJWT(auth_token);
        if (data) {
          const response = await PostModel.find({ _id: { $in: posts } }).sort({
            date: -1,
          });
          if (response.length > 0) {
            const SerializedData = {
              Post: response.Post,
              Caption: response.Caption,
              PostDate: response.PostDate,
              CreatorID: response.CreatorID,
              CreatorUsername: response.CreatorUsername,
            };
            const PrePostData = await cache.get(`PrePostData/${id}`);
            if (!PrePostData && request_count === 1) {
              await cache.set(
                `PrePostData/${id}`,
                JSON.stringify(SerializedData)
              );
            }
            return SerializedData;
          }
        }
      },
    },

    GetPrePostData: {
      type: new GraphQLList(PostSchema),
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString }
      },
      resolve: async (_, args) => {
        const { auth_token, id } = args;
        const data = CheckJWT(auth_token);
        if (data) {
          const PostData = await cache.get(`PrePostData/${id}`);
          if (PostData) {
            return JSON.parse(PostData);
          }
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "mutation",
});

const MainSchema = new GraphQLSchema({
  query: RootQuery,
});

export default MainSchema;
