
# Task sharing bot with ClaudiaJS,mongoDB.

## AWS CLI configuration and IAM set up.
- Firstly you should set up you aws credentils at .aws/credentilas with some policies
(DynamoDBfullAccess,GatewayfullAdministrator,LambdafullAccess,IAMfullAccess,AmazonAPIGatewayPushToCloudWatchLogs).It's not necessary to do if you use --role AWSLambdaBasicExecutionRole flag into npm run start command.
- Create new User with following policies at IAM with AWS console. After that you need to add keys from AWS IAM into .aws/credentials .

## Telegram bot configuration.
- For getting a Telegram bot access token - use their BotFather bot for creating bots.
- Use claudia update --configure-telegram-bot to configure the access token in your bot.

### 1.To use this App u should run these commands:
1) aws configure
2) cd src/config
3) touch .env
4) touch .env.test
- After step 3 you need paste your env variables into .env and .env.test files (Bot tokens, webhook, mongoDB).
5) npm install
- Command from 6 step will run your app localy with ngrok
6) npm run start 
- Before using command from 7 step check --profile flag, maybe you can use without this flag. This command will create new Api on AWS. 
7) npm run create

### 2.If you need to update api use:
 npm run update

### 3.To set up your webhook use:
 npm run webhook

### 4.To debug use:
 npm run debug

### 5.If you need to update app without cache:
 npm run updateFast


### Checking your bot
1) Open telegram and find there your bot
2) Type some text and enjoy

You need to configure the webhook after each launch of your local bot.


# License

MIT