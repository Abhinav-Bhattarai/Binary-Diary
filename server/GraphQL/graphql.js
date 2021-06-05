import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt } = require('graphql');

const UserSchema = new GraphQLObjectType({
    name: 'UserSchema',
    fields: () => {
        return {
            Username: {type: GraphQLString},
            Phone: {type: GraphQLInt},
            DOB: {type: GraphQLString},
            RegistrationDate: {type: GraphQLString},
            ProfilePicture: {type: GraphQLString},
            Bio: {type: GraphQLString}
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {

    }
});

const Mutation = new GraphQLObjectType({
    name: 'mutation'
});

const MainSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default MainSchema;