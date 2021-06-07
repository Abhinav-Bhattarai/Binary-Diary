import { createRequire } from "module";
import { PostModel } from "../Models/post-model.js";
import { RegisterModel } from "../Models/register-model.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

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
      DOB: { type: GraphQLString },
      ProfilePicture: { type: GraphQLString },
      Bio: { type: GraphQLString },
      Followers: { type: new GraphQLList(GraphQLString) },
      Following: { type: new GraphQLList(GraphQLString) },
      Posts: { type: new GraphQLList(GraphQLString) },
      FollowList: {
        type: new GraphQLList(UserSchema),
        resolve: async (parent, _) => {
          const { Followers } = parent;
          if (Followers.length > 0) {
            const response = await RegisterModel.find({
              _id: { $in: Followers },
            });
            if (response.length > 0) return response;
          }
        },
      },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async (parent, _) => {
          const { Following } = parent;
          if (Following.length > 0) {
            const response = await RegisterModel.find({
              _id: { $in: Following },
            });
            if (response.length > 0) return response;
          }
        },
      }
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
        const response = await RegisterModel.findById(id);
        if (response) {
          if (response.UniqueID === uid) {
            const {
              Username,
              DOB,
              ProfilePicture,
              Bio,
              Followers,
              Following,
              Posts,
            } = response;
            return {
              Username,
              DOB,
              ProfilePicture,
              Bio,
              Followers,
              Following,
              Posts,
            };
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
