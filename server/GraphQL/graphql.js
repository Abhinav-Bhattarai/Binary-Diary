import { createRequire } from "module";
import { RegisterModel } from "../Models/register-model.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLFloat,
} = require("graphql");

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
      FollowList: {
        type: new GraphQLList(UserSchema),
        resolve: async(parent, _) => {
          let { Followers } = parent;   
          if (Followers.length > 0) {
            const response = await RegisterModel.find({_id: {$in: Followers}});
            if(response.length > 0) return response;
          }    
        }
      },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async(parent, _) => {
          let { Following } = parent;
          if (Following.length > 0) {
            const response = await RegisterModel.find({_id: {$in: JSON.parse(Following)}});
            if(response.length > 0) return response;  
          }
        }
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
            const { Username, DOB, ProfilePicture, Bio, Followers, Following} = response;
            return {
              Username,
              DOB,
              ProfilePicture,
              Bio,
              Followers,
              Following
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
  query: RootQuery
});

export default MainSchema;
