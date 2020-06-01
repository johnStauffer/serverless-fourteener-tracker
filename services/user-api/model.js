import dynamodb from "serverless-dynamodb-client";

export class Model {
    constructor() {
        this.dynamoClient = dynamodb.doc;
    }

    async getUser(userId) {
        return this.dynamoClient.get(
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

    async getUserByEmail(email, normalizer) {
        const params = {
            TableName: process.env.USERS_TABLE_NAME,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ':email': normalizer(email)
            },
        };

        return new Promise((resolve, reject) => {
            this.dynamoClient.scan(params, (err, data) => {
                (err) ? reject(err) :
                    resolve((data.Count > 0) ? data.Items[0] : null);
            });
        });
    }

    async putUser(user) {
        return this.dynamoClient.put({
            TableName: process.env.USERS_TABLE_NAME,
            ReturnValues: 'ALL_OLD',
            Item: user
        }).promise();
    }

    async createUser(user) {
        return this.dynamoClient.put({
            TableName: process.env.USERS_TABLE_NAME,
            ReturnValues: 'ALL_OLD',
            Item: user
        }).promise();
    }
}

