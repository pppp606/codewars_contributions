# GitHub Contributions from Codewars
A repository for reflecting Codewars activities in the github contributions count.

## 🔨 Usage

### Step1 Use as a repository template
To start, just click the Use template link (or the green button).

### Step2 Create a personal access token
Creates the tokens needed when performing an action

[Github > Settings > Developer settings > Personal access tokens (classic)](https://github.com/settings/tokens)

- Tokens must be handled with security in mind
- Requires repo scope for action execution
- Shorter duration is safer, but periodic maintenance is required

### Step3 Create AWS Lambda function
Unfortunately, the webhook function provided in Codewars is not enough to execute github actions. We need to prepare a function to receive webhooks and execute github actions in AWS Lambda.

#### 1. Create Lambda function


#### 2. Deploy function

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

※ It is also possible to use cron to perform periodic execution without using a Lambda function or any other function. In this case, multiple changes that occur within the interval of the periodic execution will be reflected at once.

### Step4 Set Webhook URL in Codewars
Specifies the URL of the Lambda function

[Codewars > Account Setting](https://www.codewars.com/users/edit)

## 🎉 Complete
When the activity is recorded in Codewars, a webhook is fired and the github action is executed.
