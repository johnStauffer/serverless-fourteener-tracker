import {ApolloServer, gql} from 'apollo-server-lambda';
import {UserService} from './user-service';

const typeDefs = gql`
    type Location {
        city: String
        state: String
    }

    type User {
        userId: String
        firstName: String
        lastName: String
        email: String
        location: Location
    }

    input UserInput {
        userId: String!
        firstName: String!
        lastName: String!
        email: String!
        location: LocationInput
    }

    input LocationInput {
        city: String
        state: String
    }

    type Query {
        getUser(id: ID!): User
        getUserByEmail(email: String!): User
    }

    type Mutation {
        createUser(input: UserInput!): User
    }
`;

const dataSources = () => ({
    userService: new UserService()
});

const resolvers = {
    Query: {
        getUser: async (_, {id}, {dataSources}) => {
            return dataSources.userService.getUserById(id);
        },
        getUserByEmail: (_, {email}, {dataSources}) => {
            return dataSources.userService.getUserByEmail(email);
        }
    },
    Mutation: {
        createUser: (_, {input}, {dataSources}) => {
            return dataSources.userService.createUser(input);
        },
    }
};

export const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources
});
exports.graphqlHandler = server.createHandler();
