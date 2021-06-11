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
  GraphQLBoolean,
} = require("graphql");

import {
  AddPostToDatabase,
  CheckJWT,
  FollowingDataSearch,
  GetPostDataHandler,
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
      CreatorUsername: { type: GraphQLString },
      Mutated: {type: GraphQLBoolean}
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
          const { Following } = parent;
          const response = await FollowingDataSearch(Following);
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
          const response = await GetPostDataHandler(
            cache,
            id,
            posts,
            request_count
          );
          return response;
        }
      },
    },

    GetPrePostData: {
      type: new GraphQLList(PostSchema),
      args: {
        auth_token: { type: GraphQLString },
        id: { type: GraphQLString },
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
  fields: {
    AddPost: {
      type: PostSchema,
      args: {
        id: { type: GraphQLString },
        Username: { type: GraphQLString },
        Post: { type: GraphQLString },
        Caption: { type: GraphQLString },
        uid: {type: GraphQLString}
      },
      resolve: async (_, args) => {
        const db_response = await AddPostToDatabase(args);
        const unserialized_data = await cache.get(`UserInfo/${args.id}/${args.uid}`)
        const serialized_data = JSON.parse(unserialized_data);
        serialized_data.Posts.push(db_response._id);
        await cache.set(`UserInfo/${args.id}/${args.uid}`, JSON.stringify(serialized_data));
        return { Mutated: true };
      },
    },
  },
});

const MainSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default MainSchema;