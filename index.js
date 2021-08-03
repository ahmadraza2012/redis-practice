const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const clinet = redis.createClient(REDIS_PORT);

const app = express();

function setResponse(username, repos) {
  return `<h2>${username} has ${repos} of repositories.</h2>`;
}

// redis cache middleware.
function cache(req, res, next) {
  const { username } = req.params;
  clinet.get(username, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(setResponse(username.data));
    } else next();
  });
}

async function getResponse(req, res, next) {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    const repos = data.public_repos;

    clinet.setex(username, 3600, repos);
    res.send(setResponse(username, repos));
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

app.get("/repos/:username", cache, getResponse);

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
