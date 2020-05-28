import {ApolloServer, UserInputError, gql} from 'apollo-server-lambda';
import dynamodb from 'serverless-dynamodb-client';
import normalizeEmail from "normalize-email";

const dynamoClient = dynamodb.doc;

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
    }

    type Mutation {
        createUser(input: UserInput!): User
    }
`;

function getUser(userId) {
    return dynamoClient.get(
        {
            TableName: process.env.USERS_TABLE_NAME,
            Key: {userId}
        }, (err, data) => {
            if (err) console.log(err.message);
            else return data.Item;
        }
    ).promise().then(response => {
        return response.Item;
    });
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
            dynamoClient.scan({
                TableName: process.env.USERS_TABLE_NAME,
                FilterExpression: "#email = :email",
                ExpressionAttributeNames: {
                    '#email': 'email'
                },
                ExpressionAttributeValues: {
                    ':email': email
                },
                Limit: 1
            }).promise().then((result, err) => {
                if (err) reject(err);
                resolve((result.Count > 0) ? result.Items[0] : null);
            })
        }
    );
}

function putUser(user) {
    return dynamoClient.put({
        TableName: process.env.USERS_TABLE_NAME,
        ReturnValues: 'ALL_OLD',
        Item: user
    }).promise();
}

async function createUser(userInput) {
    return new Promise((resolve, reject) => {
        const normalizedUser = normalizeUser(userInput);
        getUserByEmail(normalizedUser)
            .then(existingUser => {
                if (existingUser != null) {
                    reject(new Error(`User already exists for email: ${normalizedUser.email}`))
                } else {
                    return putUser(normalizedUser);
                }
            })
            .then(() => getUser(userInput.userId)
                .then(user => {
                    resolve(user);
                }));
    });
}


const normalizeUser = userInput => {
    return ({
        userId: userInput.userId,
        firstName: userInput.firstName.toLowerCase(),
        lastName: userInput.lastName.toLowerCase(),
        email: normalizeEmail(userInput.email),
        location: userInput.location,
    });
};

const resolvers = {
    Query: {
        getUser: (parent, {id}, context, info) => {
            return getUser(id)
        },
    },
    Mutation: {
        createUser: (parent, {input}, context, info) => {
            return createUser(input)
        },
    }
};

const server = new ApolloServer({typeDefs, resolvers});
exports.graphqlHandler = server.createHandler();
