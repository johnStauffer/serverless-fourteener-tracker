import {ApolloServer, gql} from "apollo-server-lambda";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
        hello: String
        getUser(id: ID!): User
    }
    
    type Location {
        city: String
        state: String
    }

    type User {
        userId: Int!
        firstName: String!
        lastName: String!
        email: String!
        location: Location
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        getUser: (parent, {id}, context, info) => {
            return {
                userId: id,
                firstName: 'John',
                lastName: 'Stauffer',
                email: 'john.stauffer.d@gmail.com',
            };
        }
    },
};

const server = new ApolloServer({typeDefs, resolvers});
exports.graphqlHandler = server.createHandler();
