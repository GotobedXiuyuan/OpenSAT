import request from 'supertest';
import app from '../server';

describe('GET /get-recommendation', () => {
  test('should return a recommendation for valid request', async () => {
    const response = await request(app)
      .get('/get-recommendation')
      .query({ question_id: '281a4f3b', user_id: 'testUserId' })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recommendation");
  });

  test('should return error for missing parameter', async () => {
    const response = await request(app)
      .get('/get-recommendation') // no query parameters
      .expect(400);

    expect(response.text).toBe('Question ID is a required string');
  });

});


//GET /get-progress-data
describe('GET /get-progress-data', () => {
  test('should return progress data for authorized student', async () => {
    const response = await request(app)
      .get('/get-progress-data')
      .query({ userType: 'student', userId: 'testUserId' })
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('should return 403 for non-student user type', async () => {
    const response = await request(app)
      .get('/get-progress-data')
      .query({ userType: 'parent', userId: 'testUserId' })
      .expect(403);

    expect(response.text).toBe('Access denied: Only students can get progress data');
  });

  test('should return 400 for missing parameters', async () => {
    const response = await request(app)
      .get('/get-progress-data')
      .query({}) // Missing userType and userId
      .expect(400);

    expect(response.text).toContain('User type is a required string');
  });
});

describe('GET /get-random-questions', () => {
  // NEW TEST: User who answered all questions
  test('should return an empty array if user answered all questions', async () => {
    const response = await request(app)
      .get('/get-random-questions')
      .query({ user_id: 'userWhoAnsweredAll' })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /update-progress-data', () => {
  // NEW TEST: Missing required field
  test('should return 400 if questionId is missing', async () => {
    const response = await request(app)
      .post('/update-progress-data')
      .send({ userId: 'testUserId', correct: true }) // no questionId
      .expect(400);

    expect(response.text).toBe('Question ID is a required string');
  });

});

describe('GET /get-student-accuracy', () => {

  test('should return 400 for valid timeframe', async () => {
    const response = await request(app)
      .get('/get-student-accuracy')
      .query({ userId: 'testUserId', timeframe: 'week' }) // not 'week' or 'month'
      .expect(200);
  });
});


//POST /set-user-type
describe('POST /set-user-type', () => {
  test('should update user type successfully', async () => {
    const response = await request(app)
      .post('/set-user-type')
      .send({
        userType: 'student',
        userId: 'testUserId',
        authenticated: true,
      })
      .expect(200);

    expect(response.body.message).toBe('User type updated to student');
  });

  test('should return 400 for invalid userType', async () => {
    const response = await request(app)
      .post('/set-user-type')
      .send({
        userType: 'invalidType',
        userId: 'testUserId',
        authenticated: true,
      })
      .expect(400);

    expect(response.body.error).toBe('Invalid user type');
  });

  test('should return 403 if not authenticated', async () => {
    const response = await request(app)
      .post('/set-user-type')
      .send({
        userType: 'student',
        userId: 'testUserId',
        authenticated: false, // Not authenticated
      })
      .expect(403);

    expect(response.body.error).toBe('User is not authenticated');
  });

  test('should return 400 for missing userId', async () => {
    const response = await request(app)
      .post('/set-user-type')
      .send({
        userType: 'student',
        authenticated: true, // Missing userId
      })
      .expect(400);

    expect(response.body.error).toBe('User ID is required');
  });
});