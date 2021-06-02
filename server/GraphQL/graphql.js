import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');

const UserSchema = new GraphQLObjectType({
    name: 'UserSchema',
    fields: () => {
        return {
            Username: {type: GraphQLString}
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