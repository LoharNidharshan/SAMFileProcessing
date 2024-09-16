S3 File Processing Lambda Function
Overview
This application is a serverless function deployed using AWS Lambda, triggered by an Amazon S3 event. When an object (e.g., a file) is uploaded to a specified S3 bucket, this Lambda function is triggered to retrieve the file content, process it, and return a response. The function is built using Node.js and leverages the AWS SDK to interact with S3.

Features
Event-Driven: Automatically triggered by S3 events (e.g., file upload).
File Retrieval: Retrieves the uploaded file from the S3 bucket.
File Processing: Converts the content of the file to a string (assuming it's a text file).
Logging: Logs the content of the file for easy debugging and traceability.
Error Handling: Implements robust error handling with status code responses for success and failure cases.
Flow
S3 Event:

The Lambda function is triggered by an S3 event, such as an s3:ObjectCreated:Put event. The event includes details about the S3 bucket and the object (file) that was added.
S3 File Retrieval:

The Lambda function extracts the bucket name and object key (file name) from the event, then uses the AWS SDK to call the getObject method to retrieve the file from S3.
File Processing:

The content of the file is read and converted to a string. This functionality assumes the file is in a text format, such as .txt.
Response:

The function returns a JSON response with the status of the operation. If successful, it returns the file's content and a success message. If an error occurs, it returns an error message along with a 500 status code.
Technologies Used
AWS Lambda: A compute service that runs the function when triggered by an event from S3.
Amazon S3: Used as a storage service to trigger the function when a new file is uploaded.
Node.js: The runtime environment for the Lambda function.
AWS SDK: Utilized to interact with S3 and retrieve objects.
Installation and Setup
Pre-requisites:

AWS account with permissions to create Lambda functions and S3 buckets.
Node.js installed locally for development.
AWS SAM CLI for deploying the Lambda function.
Deploy the Lambda Function:

Use AWS SAM (Serverless Application Model) to deploy the function. A sample template.yaml file should define the function and its event source (S3).
Ensure the correct IAM roles and permissions are set for the Lambda function to read from S3.
Configure S3 Event:

Set up an event notification on your S3 bucket to trigger the Lambda function whenever a new object is created.

Example Event Input
The function expects an event in the following format, which is automatically sent by S3:

```json
{
    "Records": [
        {
            "s3": {
                "bucket": {
                    "name": "your-bucket-name"
                },
                "object": {
                    "key": "your-object-key"
                }
            }
        }
    ]
}
```
Example Response
Upon successful file retrieval, the function will return:

json
Copy code
{
    "statusCode": 200,
    "body": "{\"message\": \"Successfully processed your-object-key\", \"content\": \"<file-content-here>\"}"
}
If an error occurs during file retrieval or processing, the response will be:

json
Copy code
{
    "statusCode": 500,
    "body": "{\"message\": \"Error processing the file\", \"error\": \"<error-message>\"}"
}
Error Handling
If the function is unable to retrieve the file from S3, an error message will be logged, and a 500 status code will be returned with the error details in the response.
