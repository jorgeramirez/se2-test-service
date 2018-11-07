const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PROXY_METHODS = ['get', 'post', 'put', 'delete'];

/**
 * Returns a promise that calls the given URL.
 *
 * @param {String} url
 * @param {String} httpMethod
 * @param {Object} payload
 */
const proxy = async (
  url,
  httpMethod,
  expectedResultStatus,
  payload = undefined
) => {
  if (!url || !httpMethod || !expectedResultStatus) {
    throw new Error(
      'url, httpMethod, and expectedResultStatus are required parameters'
    );
  }

  if (!PROXY_METHODS.includes(httpMethod)) {
    throw new Error('HTTP method not supported.');
  }

  let response = await fetch(url, {
    method: httpMethod,
    body: httpMethod !== 'get' ? JSON.stringify(payload) : payload,
    headers: { 'Content-Type': 'application/json' }
  });
  return response.status === expectedResultStatus;
};

// helth check
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

app.post('/proxy', async (req, res) => {
  const { url, httpMethod, expectedResultStatus, payload } = req.body;

  try {
    let success = await proxy(url, httpMethod, expectedResultStatus, payload);
    res.json({ success });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = app;
