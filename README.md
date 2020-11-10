
# Task sharing bot with ClaudiaJS,mongoDB.

## AWS CLI configuration and IAM set up.
Firstly you should set up you aws credentils at .aws/credentilas with some policies
(DynamoDBfullAccess,GatewayfullAdministrator,LambdafullAccess,IAMfullAccess,AmazonAPIGatewayPushToCloudWatchLogs).
Create new User with following policies at IAM with AWS console. After that you need to add keys from AWS IAM into .aws/credentials .

## Telegram bot configuration.
For getting a Telegram bot access token - use their BotFather bot for creating bots.
Use claudia update --configure-telegram-bot to configure the access token in your bot.

## To run & check this App u should run these commands:
1) aws configure
2) npm install
3) npm run create 

If you need to update api use:
4) npm run update


## Routes
You will take base URL after npm run create command.

