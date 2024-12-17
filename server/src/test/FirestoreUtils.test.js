"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const FirestoreUtils_1 = require("../FirestoreUtils");
const admin = __importStar(require("firebase-admin"));
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config();
//comment out when you use env. 
const serviceAccountPath = path_1.default.join(__dirname, '../../res/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
describe('FirestoreUtils', () => {
    let firestoreUtils;
    beforeAll(() => {
        firestoreUtils = new FirestoreUtils_1.FirestoreUtils(db);
    });
    // update student progress tests 
    test('should update student progress successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.updateStudentProgress('testUserId', 'testQuestionId', 'correctAnswer', 'answerChosen', true);
        console.log('Response:', response);
        expect(response.type).toBe('success');
        expect(response.details).toBe('Question progress updated successfully');
    }));
    test('should fail to update student progress with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.updateStudentProgress('', '', '', '', true);
        expect(response.type).toBe('failure');
        expect(response.details).toContain('Error updating question progress');
    }));
    // get progress data tests 
    test('should retrieve user progress successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.getUserProgress('testUserId');
        expect(response.type).toBe('success');
        expect(response.data).toBeInstanceOf(Array);
        expect(response.details).toBe('User progress retrieved successfully');
    }));
    test('should fail to retrieve user progress with invalid userId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.getUserProgress('');
        expect(response.type).toBe('failure');
        expect(response.details).toContain('Error retrieving user progress');
    }));
    test('should return empty progress for valid user with no questions', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.getUserProgress('QNUdC5WwMnBGIJ5vpS3w');
        expect(response.type).toBe('success');
        expect(response.data).toEqual([]); // Ensure no progress is returned
        expect(response.details).toBe('User progress retrieved successfully');
    }));
    //get accuracy
    test('should return 0% accuracy if user has no questions in timeframe', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield firestoreUtils.getStudentAccuracy('userNoQuestions', 'week');
        expect(response.type).toBe('success');
        expect(response.data).toHaveProperty('averageAccuracy', 0);
    }));
});
