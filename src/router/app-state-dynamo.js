const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = 'DistrictAffairsBotState';

const appStates = require('./app-states');

module.exports.getUserState = (userId) => {
    return new Promise((resolve, reject) => {
        const params = { TableName, Key: { userId: `${userId}` } };
        docClient.get(params, (err, data) => {
            if (!err) {
                resolve(!data.Item ? { appStateId: appStates.NEW_USER_START.id, lang: 'en' } : data.Item);
            } else {
                reject(new Error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2)));
            }
        });
    });
};

module.exports.setUserState = (userId, state) => {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line prettier/prettier
        const params = { TableName, Item: { userId: `${userId}`, ...state } };
        docClient.put(params, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(new Error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2)));
            }
        });
    });
};
