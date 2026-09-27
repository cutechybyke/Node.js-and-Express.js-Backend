const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

test('access tokens preserve username and roles', () => {
  const secret = 'test-access-secret';
  const payload = { UserInfo: { username: 'demo', roles: [2001] } };
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  const decoded = jwt.verify(token, secret);

  assert.equal(decoded.UserInfo.username, 'demo');
  assert.deepEqual(decoded.UserInfo.roles, [2001]);
  assert.ok(decoded.exp > decoded.iat);
});

test('tokens signed with another secret are rejected', () => {
  const token = jwt.sign({ UserInfo: { username: 'demo', roles: [] } }, 'secret-a');
  assert.throws(() => jwt.verify(token, 'secret-b'));
});
