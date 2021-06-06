import { createRequire } from "module";
import { RegisterModel } from "../Models/register-model.js";
const require = createRequire(import.meta.url);
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
} = require("graphql");

const UserSchema = new GraphQLObjectType({
  name: "UserSchema",
  fields: () => {
    return {
      Username: { type: GraphQLString },
      Phone: { type: GraphQLInt },
      DOB: { type: GraphQLString },
      RegistrationDate: { type: GraphQLString },
      ProfilePicture: { type: GraphQLString },
      Bio: { type: GraphQLString },
      Followers: { type: GraphQLString },
      Following: { type: GraphQLString },
      FollowList: {
        type: new GraphQLList(UserSchema),
        resolve: async(parent, _) => {
          let { Followers } = parent;
          Followers = JSON.parse(Followers);          
          
          const response = await RegisterModel.find({_id: {$in: Followers}});
          if(response.length > 0) return response;
        }
      },
      FollowingList: {
        type: new GraphQLList(UserSchema),
        resolve: async(parent, _) => {
          const { Following } = parent;
          const response = await RegisterModel.find({_id: {$in: JSON.parse(Following)}});
          if(response.length > 0) return response;
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
            const { Username, Phone, DOB, RegistrationDate, ProfilePicture, Bio, Followers, Following} = response;
            return {
              Username,
              Phone,
              DOB,
              RegistrationDate,
              ProfilePicture,
              Bio,
              Followers: JSON.stringify(Followers),
              Following: JSON.stringify(Following)
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
