#S3 File Processing Lambda Function
##Overview
This serverless application, built using AWS SAM (Serverless Application Model), processes files uploaded to an Amazon S3 bucket. The application is designed to trigger a Lambda function whenever a file with a .txt extension is uploaded to the S3 bucket. The Lambda function retrieves the file content, logs it, and returns a response. The application also integrates Amazon CloudWatch for monitoring and AWS Application Insights for automatic resource grouping and monitoring.

##Features
Event-Driven Architecture: Automatically triggers a Lambda function when an S3 event (such as file upload) occurs.
File Content Retrieval: Retrieves the content of the uploaded file from S3 and logs it.
Monitoring & Tracing: The application is instrumented with AWS X-Ray for distributed tracing and CloudWatch for logging and monitoring.
Application Insights Integration: Uses AWS Application Insights for enhanced monitoring, automatic problem detection, and resource grouping.
Built with AWS SAM: Utilizes SAM to simplify the deployment and management of serverless resources.
##Architecture
The core components of the application are:

###S3 Bucket: Stores the uploaded files and triggers the Lambda function when a file is uploaded.
Lambda Function: Processes the uploaded file by retrieving it from the S3 bucket and logging the content. This function is triggered by S3 events.
AWS Application Insights: Provides enhanced observability into the application by automatically grouping resources and enabling auto-configuration for monitoring.
SAM Template Details
The following is an overview of the AWS resources defined in the SAM template (template.yaml):

##S3Bucket:

Creates an S3 bucket to store the uploaded files.
This bucket is configured to trigger the Lambda function when a file with a .txt extension is created.
HelloWorldFunction:

A Lambda function written in Node.js (runtime: nodejs20.x) that is triggered by the S3 bucket.
The function retrieves the content of the uploaded .txt file from S3 and logs it.
Policies include AmazonS3FullAccess to allow the Lambda function to interact with the S3 bucket.
ApplicationResourceGroup & ApplicationInsightsMonitoring:

These resources set up AWS Application Insights to monitor the Lambda function and other resources in the stack.
Application Insights automatically configures metrics, alarms, and logs for improved observability.
Sample SAM Template
```
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  FileProcessing Application

  Sample SAM Template for S3 File Processing Application

Globals:
  Function:
    Timeout: 3
    Tracing: Active
    LoggingConfig:
      LogFormat: JSON
  Api:
    TracingEnabled: true

Resources:

  S3Bucket:
    Type: 'AWS::S3::Bucket'

  HelloWorldFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: hello-world/
      Handler: app.lambdaHandler
      Runtime: nodejs20.x
      Architectures:
        - x86_64
      Policies:
        - AmazonS3FullAccess
      Events:
        AllS3Events:
          Type: S3
          Properties:
            Bucket: !Ref S3Bucket
            Events: 
              - s3:ObjectCreated:*
            Filter:
              S3Key:
                Rules:
                  - Name: suffix
                    Value: ".txt"

  ApplicationResourceGroup:
    Type: AWS::ResourceGroups::Group
    Properties:
      Name: 
        Fn::Sub: ApplicationInsights-SAM-${AWS::StackName}
      ResourceQuery:
        Type: CLOUDFORMATION_STACK_1_0

  ApplicationInsightsMonitoring:
    Type: AWS::ApplicationInsights::Application
    Properties:
      ResourceGroupName: 
        Ref: ApplicationResourceGroup
      AutoConfigurationEnabled: 'true'
```
##Key Properties in the Template
###S3 Bucket Event Trigger: The S3Bucket resource triggers the Lambda function when a new .txt file is uploaded, using the s3:ObjectCreated:* event.
###Policies: The Lambda function has AmazonS3FullAccess permissions, enabling it to retrieve the files from the S3 bucket.
###Tracing: The Lambda function and API Gateway (if present) are configured for tracing with AWS X-Ray to help with performance monitoring.
###Application Insights: Automatic setup for Application Insights enables enhanced monitoring for better visibility into the health and performance of the application.
##Prerequisites
###AWS Account: Ensure you have an AWS account with permissions to create and manage S3, Lambda, CloudWatch, and Application Insights resources.
###Node.js: Install Node.js for local development.
###AWS SAM CLI: Install the AWS SAM CLI to build and deploy the application.
##Deployment Instructions
##Build the Application:

```bash
sam build
Deploy the Application:
```
```bash
sam deploy --guided
```
This command will package the Lambda function and deploy it along with the S3 bucket, Application Insights, and other resources defined in the template.

##Monitor the Application:

Use CloudWatch Logs to view logs of the Lambda function.
Use AWS X-Ray for tracing and performance analysis.
Use AWS Application Insights for automatic problem detection and resource monitoring.
Example S3 Event Input
The Lambda function expects an event in the following format, which is automatically sent by S3:

```json
Copy code
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
##Example Response
Upon successful file retrieval and processing, the function returns:

```json
{
    "statusCode": 200,
    "body": "{\"message\": \"Successfully processed your-object-key\", \"content\": \"<file-content-here>\"}"
}
```
