const request = require('supertest');

const app = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

test('Testing method=GET url=www.google.com expectedStatus=200', async () => {
  const response = await request(app)
    .post('/proxy')
    .send({
      url: 'https://www.google.com',
      httpMethod: 'get',
      expectedResultStatus: 200
    })
    .set('Accept', 'application/json');
  expect(response.body.success).toBeDefined();
  expect(response.body.success).toBe(true);
});

test('Testing method=POST url=https://jsonplaceholder.typicode.com/posts expectedStatus=201', async () => {
  const response = await request(app)
    .post('/proxy')
    .send({
      url: 'https://jsonplaceholder.typicode.com/posts',
      httpMethod: 'post',
      expectedResultStatus: 201,
      payload: {
        title: 'foo',
        body: 'bar',
        userId: 1
      }
    })
    .set('Accept', 'application/json');
  expect(response.body.success).toBeDefined();
  expect(response.body.success).toBe(true);
});
