# GitHub Contributions from Codewars
A repository for reflecting Codewars activities in the github contributions count.

## 🔨 Usage

### Step1 Use as a repository template
To start, just click the [Use this template link](https://github.com/pppp606/codewars_contributions/generate). Create a new repository

### Step2 Create a personal access token
Creates the tokens needed when performing an action. Make sure to grant permissions only to repositories you create 🔐

[Github > Settings > Developer settings > Fine-grained personal access tokens](https://github.com/settings/tokens?type=beta)

> **Note**
> - Tokens must be handled with security in mind
> - Shorter duration is safer, but periodic maintenance is required

### Step3 Create AWS Lambda function
Unfortunately, the webhook function provided in Codewars is not enough to execute github actions. We need to prepare a function to receive webhooks and execute github actions in AWS Lambda.

#### 1. Create Lambda function
Log in to AWS and go to lambda > Functions > Create Function. Create a function with the following settings.

![lambda](https://user-images.githubusercontent.com/7203958/199429922-2672fbd9-1307-4e10-ba61-b77e3fcd62e1.png)

#### 2. Deploy function
Paste the following code into index.js and deploy.

※Rewrite the variables in line 4-6 to match your environment.

```js
const https = require('https');

// TODO: Change it to match your env
const token = '___yourToken___';
const githubId = '___yourGithubId___';
const repoName = '___yourRepositoryName___';

const request = () => {
  const url = `https://api.github.com/repos/${githubId}/${repoName}/dispatches`;
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Lambda script'
    }
  };
  const body = JSON.stringify({
    'event_type': 'codewars_update'
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      })
        .on('end', () => {
          resolve(data);
        });
    }).on('error', (error) => {
      reject(error);
    });

    req.setTimeout(60);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  await request();
  const response = {
    statusCode: 200,
    body: JSON.stringify('OK'),
  };
  return response;
};
```

#### 3. Copy function URL
The URL to execute the Lambda function will be displayed. Copy this URL.

> **Note**
> 
> It is also possible to use cron to perform periodic execution without using a Lambda function or any other function. In this case, multiple changes that > occur within the interval of the periodic execution will be reflected at once.

### Step4 Set Webhook URL in Codewars
Specifies the URL of the Lambda function

[Codewars > Account Setting](https://www.codewars.com/users/edit)
![webhook](https://user-images.githubusercontent.com/7203958/199430339-8ac2e9a8-8a9e-4cfa-8bc6-e5f71c1bc914.png)

## 🎉 Complete
When the activity is recorded in Codewars, a webhook is fired and the github action is executed.
