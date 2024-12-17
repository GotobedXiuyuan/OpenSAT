"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe('GET /get-recommendation', () => {
    test('should return a recommendation for valid request', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-recommendation')
            .query({ question_id: '281a4f3b', user_id: 'testUserId' })
            .expect(200);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("recommendation");
    }));
    test('should return error for missing parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-recommendation') // no query parameters
            .expect(400);
        expect(response.text).toBe('Question ID is a required string');
    }));
});
//GET /get-progress-data
describe('GET /get-progress-data', () => {
    test('should return progress data for authorized student', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-progress-data')
            .query({ userType: 'student', userId: 'testUserId' })
            .expect(200);
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    }));
    test('should return 403 for non-student user type', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-progress-data')
            .query({ userType: 'parent', userId: 'testUserId' })
            .expect(403);
        expect(response.text).toBe('Access denied: Only students can get progress data');
    }));
    test('should return 400 for missing parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-progress-data')
            .query({}) // Missing userType and userId
            .expect(400);
        expect(response.text).toContain('User type is a required string');
    }));
});
describe('GET /get-random-questions', () => {
    // NEW TEST: User who answered all questions
    test('should return an empty array if user answered all questions', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-random-questions')
            .query({ user_id: 'userWhoAnsweredAll' })
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
});
describe('POST /update-progress-data', () => {
    // NEW TEST: Missing required field
    test('should return 400 if questionId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/update-progress-data')
            .send({ userId: 'testUserId', correct: true }) // no questionId
            .expect(400);
        expect(response.text).toBe('Question ID is a required string');
    }));
});
describe('GET /get-student-accuracy', () => {
    test('should return 400 for valid timeframe', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .get('/get-student-accuracy')
            .query({ userId: 'testUserId', timeframe: 'week' }) // not 'week' or 'month'
            .expect(200);
    }));
});
//POST /set-user-type
describe('POST /set-user-type', () => {
    test('should update user type successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/set-user-type')
            .send({
            userType: 'student',
            userId: 'testUserId',
            authenticated: true,
        })
            .expect(200);
        expect(response.body.message).toBe('User type updated to student');
    }));
    test('should return 400 for invalid userType', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/set-user-type')
            .send({
            userType: 'invalidType',
            userId: 'testUserId',
            authenticated: true,
        })
            .expect(400);
        expect(response.body.error).toBe('Invalid user type');
    }));
    test('should return 403 if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/set-user-type')
            .send({
            userType: 'student',
            userId: 'testUserId',
            authenticated: false, // Not authenticated
        })
            .expect(403);
        expect(response.body.error).toBe('User is not authenticated');
    }));
    test('should return 400 for missing userId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/set-user-type')
            .send({
            userType: 'student',
            authenticated: true, // Missing userId
        })
            .expect(400);
        expect(response.body.error).toBe('User ID is required');
    }));
});
