import redis from "async-redis";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
import { PostModel } from "../Models/post-model.js";
import { RegisterModel } from "../Models/register-model.js";

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
      // FollowerList: {
      //   type: new GraphQLList(UserSchema),
      //   resolve: async (parent, _) => {
      //     const { Followers } = parent;
      //     if (Followers.length > 0) {
      //       const response = await RegisterModel.find({
      //         _id: { $in: Followers },
      //       });
      //       if (response.length > 0) return response;
      //     }
      //   },
      // },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async (parent, _) => {
          const { Username, Following } = parent;
          if (Following.length > 0) {
            const response = await RegisterModel.find({
              _id: { $in: Following },
            }, {
              Username: 1,
              Followers: 1,
              Following: 1,
              Bio: 1,
              Posts: 1,
              ProfilePicture: 1
            });
            if (response.length > 0) {
              // await cache.set(`FollowingInfo/${Username}`, JSON.stringify(response));
              console.log(response, 'Response');
              return response;
            };
          }
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
        const response = await RegisterModel.findById(id, {
          Username: 1,
          Followers: 1,
          Following: 1,
          Bio: 1,
          Posts: 1,
          ProfilePicture: 1,
          UniqueID: 1,
          _id: 0
        });
        if (response !== null) {
          if (response.UniqueID === uid) {
            let SerializedData = { Username, Followers, Following, Bio, Posts, ProfilePicture } = response; 
            // await cache.set(`UserInfo/${response.Username}`, JSON.stringify(Data));
            return SerializedData;
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
