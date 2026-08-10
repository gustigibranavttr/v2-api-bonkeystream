const assert = require('node:assert/strict');
const { after, test } = require('node:test');
const axios = require('axios');
const { resolveStream } = require('../routes/resolve');

const originalAxiosGet = axios.get;

after(() => {
  axios.get = originalAxiosGet;
});

function createResponse() {
  return {
    headers: new Map(),
    body: undefined,
    statusCode: 200,
    set(name, value) {
      this.headers.set(name.toLowerCase(), value);
      return this;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    redirect(statusCode, location) {
      this.statusCode = statusCode;
      this.set('Location', location);
      return this;
    },
  };
}

test('successful resolver redirects are readable across origins', async () => {
  const directUrl = 'https://media.example.test/episode-1.mp4';
  axios.get = async () => ({ data: { ok: true, url: directUrl } });

  const sourceUrl = 'https://stordl.halahgan.com/streaming//episode-id?name=episode.mp4';
  const response = createResponse();
  let forwardedError;

  await resolveStream(
    { query: { url: sourceUrl } },
    response,
    (error) => { forwardedError = error; },
  );

  assert.equal(forwardedError, undefined);
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers.get('location'), directUrl);
  assert.equal(response.headers.get('cross-origin-resource-policy'), 'cross-origin');
});

test('invalid resolver input does not weaken the resource policy', async () => {
  const response = createResponse();

  await resolveStream(
    { query: { url: 'https://example.test/not-a-stream' } },
    response,
    assert.fail,
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.headers.has('cross-origin-resource-policy'), false);
  assert.equal(response.body.success, false);
});

test('an unresolved upstream response is not redirected', async () => {
  axios.get = async () => ({ data: { ok: false } });

  const response = createResponse();
  const sourceUrl = 'https://stordl.halahgan.com/streaming//episode-id';

  await resolveStream(
    { query: { url: sourceUrl } },
    response,
    assert.fail,
  );

  assert.equal(response.statusCode, 500);
  assert.equal(response.headers.has('location'), false);
  assert.equal(response.headers.has('cross-origin-resource-policy'), false);
});
