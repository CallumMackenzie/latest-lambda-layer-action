# Latest Lambda Layer Action

This action takes given aws credentials and updates the lambda layers of the given function to their latest versions

## Usage
```yaml
name: Update AWS Lambda Function Layers

on:
  release:
    types: [created]
  push:
    branches:
      - master

jobs:
  update_lambda_layers:
  	name: Update lambda layer versions
    runs-on: ubuntu-latest
    steps:
      - name: Update layers
        uses: callummackenzie/latest-lambda-layer-action@v1
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: ${{ secrets.AWS_REGION }
          function_name: SomeAWSFunction
```
## Parameters
- aws_access_key_id
  - Required
  - The aws access key id for an IAM user
- aws_secret_access_key
  - Required
  - The secret access key for the same IAM user used in aws_access_key_id
- aws_region
  - Required
  - The aws region in which the desired lambda function is located such as us-east-1
- function_name
  - Required
  - The lambda function name to be updated (not the ARN)

## AWS Permissions Policy
The AWS IAM user this action uses must have permissions to:
- **lambda:GetFunctionConfiguration** for the desired lambda(s)
- **lambda:ListLayerVersions** for the desired layer(s)
- **lambda:UpdateFunctionConfiguration** for the desired lambda(s)