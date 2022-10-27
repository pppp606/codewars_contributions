## Step1 リポジトリをフォーク
リポジトリをあなたのスペースにフォークしてください。

## Step2 create a personal access token
アクションを実行する際に必要なトークンを作成します

[https://github.com/settings/tokens](https://github.com/settings/tokens)

- トークンは安全を考慮して扱ってください
- actionの実行にrepoスコープが必要です
- 期間が短い方が安全ですが、定期期なメンテナンスが必要になります

[https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token]url(https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)


## Step3 create AWS Lambda function
残念ながら Codewars に用意されている webhook の機能だけでは github action を実行する事ができません。
AWS Lambda で webhook を受け取り、github action を実行する為の関数を用意します。

### Lambda関数を作成


### コードを保存してデプロイ

```js
const https = require('https');

const token = '___yourToken___';
const githubId = '___yourGithubId___';
const repoName = 'codewars_contributions';

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

### URLをコピー
Lambda関数を実行する為のURLが表示されます。このURLをコピーしておきます。

※ Lambda関数やそれに変わる機能を使わず、cronで定期的に実行する事も可能です。その場合、定期実行のインターバル内で起こった複数の変更を一度に反映する事になります。

## Step4 Cordewars に webhook を設定
Lambda関数のURLを指定します

## Complete!
kataを解いてみてください。
解いたら webhook が発火して github action が実行されます。
contributions の数が増えれば成功です。
