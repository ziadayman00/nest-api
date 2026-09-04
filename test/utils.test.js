const test = require('node:test');
const assert = require('node:assert/strict');

const toSlug = require('../src/utils/slug');
const getPagination = require('../src/utils/pagination');
const AppError = require('../src/utils/app-error');

test('creates stable URL slugs', () => {
  assert.equal(toSlug('  Luna Chair - Dark Green  '), 'luna-chair-dark-green');
});

test('constrains pagination to safe values', () => {
  assert.deepEqual(getPagination({ page: '-1', limit: '500' }), { page: 1, limit: 100, offset: 0 });
});

test('preserves structured application errors', () => {
  const error = new AppError('Missing resource', 404, { message: 'Missing resource' });
  assert.equal(error.statusCode, 404);
  assert.equal(error.data.message, 'Missing resource');
});
