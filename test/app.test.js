const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

require('dotenv').config();
const app = require('../src/app');

test('returns JSend health response', async () => {
  const response = await request(app).get('/');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'success');
});

test('returns JSend fail response for unknown routes', async () => {
  const response = await request(app).get('/not-a-real-route');
  assert.equal(response.status, 404);
  assert.equal(response.body.status, 'fail');
});
