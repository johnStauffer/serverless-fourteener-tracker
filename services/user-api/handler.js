import {ApolloServer, gql} from 'apollo-server-lambda';
import dynamodb from 'serverless-dynamodb-client';

const dynamoClient = dynamodb.doc;

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

const getUser = (userId) => {
    const params = {
        TableName: process.env.USERS_TABLE_NAME,
        Key: {
            HashKey: userId
        }
    };
    console.log(params);
    // return dynamoClient.scan(params, (err, data) => {
    //     if (err) {
    //         throw err;
    //     } else return data;
    // });

    return {
        userId: '2b49236e-8506-11ea-bc55-0242ac130003',
        firstName: 'John',
        lastName: 'Stauffer',
        email: 'john.stauffer.d@gmail.com',
        location: {
            city: 'Denver',
            state: 'Colorado'
        }
    }
};

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        getUser: (parent, {id}, context, info) => {
            return getUser(id);
        }
    },
};

const server = new ApolloServer({typeDefs, resolvers});
exports.graphqlHandler = server.createHandler();
