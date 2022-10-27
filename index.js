import fetch from "node-fetch"
import crypto from "crypto"
import fs from "fs"

const userId = process.env.npm_config_user_id;

const getCompleted = (page) => {
  return new Promise((resolve, reject) => {
    fetch(`https://www.codewars.com/api/v1/users/${userId}/code-challenges/completed?page=${page}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(async (data) => {
        resolve(data);
      })
      .catch(err => {
        resolve(err);
      });
  });
};

const writeDigest = (text) => {
  const digest = crypto.createHash('sha256').update(text).digest('hex');
  fs.writeFileSync(".log", `completes: ${digest}`);
}

const main = async () => {
  let page = 0;
  let completes = [];
  let nextPage = true;
  while (nextPage) {
    const res = await getCompleted(page);
    if (res && res.data && res.data.length > 0) {
      completes = [...completes, ...res.data];
      page++;
    } else {
      nextPage = false
    }
  }
  const text = JSON.stringify(completes);
  writeDigest(text)  
}

main();
  