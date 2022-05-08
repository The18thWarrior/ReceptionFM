require('dotenv').config();
const util = require('util');
const utility = require('./utility.js');
const AWS = require('aws-sdk');
const { Interface } = require('readline');
const region = "us-west-2";
const queryProjection = 'name,type,postId,channelId,postContractAddress,msg,keywords,sender';
const tableName = 'event_data';
AWS.config.update({
    region: region
});
var docClient = new AWS.DynamoDB.DocumentClient();


/**
   * Function to save ict-activation-history rows to DynamoDB
   * @param {!activation} obj activation history object 
*/
const createEvent = (event) => {
    var params = {
        TableName: tableName,
        Item: event
    };

    return docClient.put(params).promise();
};

/**
   * Function to save ict-activation-history rows to DynamoDB
   * @param {!options} obj DynamoDB query parameters : https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
   * @returns {!promise} promise with returned items : https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Response.html
*/
const getEvent = (options) => {
    var params = {
        TableName: tableName,
        ProjectionExpression: queryProjection,
        FilterExpression: options.expression,
        ExpressionAttributeValues: options.expressionMap
    };

    return docClient.scan(params).promise();
};

/**
   * Function to delete ict-activation-history rows in DynamoDB
   * @param {!activations} array array of activations
   * @returns {!promise} promise with results of all delete operations
*/
const deleteEvents = (activations) => {
    let allPromises = [];
    for (let a of activations) {
        var params = {
            TableName: tableName,
            Key: {
                historyId : a.historyId, 
                sortHash : 'test'
            }
        };

        allPromises.push(docClient.delete(params).promise());
    }
    return Promise.allSettled(allPromises);
};

const EventDetail = () => {
    return {
        type: null,
        transactionHash: null,
        blockNumber: null,
        postId: null,
        channelId: null,
        postContractAddress: null,
        msg: null,
        keywords: null,
        sender: null,
        role: null,
        account: null
    };
};

const ActivationRequestOptions = () => {
    return {
        expression: 'clientId = :clientId',
        expressionMap: {
            ':clientId' : '12234'
        }
    };
};

exports.EventDetail = EventDetail;
exports.ActivationRequestOptions = ActivationRequestOptions;
exports.getEvent = getEvent;
exports.createEvent = createEvent;
exports.deleteEvents = deleteEvents;
