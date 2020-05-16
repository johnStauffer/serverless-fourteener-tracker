import {ApolloServer, gql} from 'apollo-server-lambda';
import dynamodb from 'serverless-dynamodb-client';

const dynamoClient = dynamodb.doc;

const typeDefs = gql`
    type Location {
        city: String
        state: String
    }

    type User {
        userId: String!
        firstName: String!
        lastName: String!
        email: String!
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
    }

    type Mutation {
        createUser(input: UserInput!): String
    }
`;

const getUser = userId => new Promise((resolve, reject) => {
    dynamoClient.get(
        {
            TableName: process.env.USERS_TABLE_NAME,
            Key: {userId}
        },
        (err, data) => {
            if (err) reject(err);
            else resolve(data.Item);
        });
});

const putUser = user => new Promise((resolve, reject) => {
    dynamoClient.put({
            TableName: process.env.USERS_TABLE_NAME,
            Item: user
        },
        (err, data) => {
            if (err) reject(err);
            else resolve();
        });
});

const resolvers = {
    Query: {
        getUser: (parent, {id}, context, info) => {
            return getUser(id)
                .then(user => {
                    console.log(`retrieved user: ${id}`);
                    return user;
                });
        },
    },
    Mutation: {
        createUser: (parent, {input}, context, info) => {
            return putUser(input)
                .then(() => getUser(input.userId))
                .then(user => {
                    console.log(`Created user: ${user.userId}`);
                    return user;
                });
        },
    }
};

const server = new ApolloServer({typeDefs, resolvers});
exports.graphqlHandler = server.createHandler();
