/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

// const AWS = require('aws-sdk');
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

export const lambdaHandler = async (event) => {
    try {
        // Extract the bucket name and object key from the S3 event
        const bucketName = event.Records[0].s3.bucket.name;
        const objectKey = event.Records[0].s3.object.key;

        // Get the object from the S3 bucket
        const params = {
            Bucket: bucketName,
            Key: objectKey,
        };

        const data = await s3.getObject(params).promise();

        // Convert the data to a string (assuming it's a text file)
        const fileContent = data.Body.toString('utf-8');

        // Log the file content
        console.log(`Content of ${objectKey}:\n${fileContent}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully processed ${objectKey}`,
                content: fileContent,
            }),
        };

    } catch (error) {
        console.error(`Error getting object from bucket .`, error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing the file",
                error: error.message,
            }),
        };
    }
};

  