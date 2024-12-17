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
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const FirestoreUtils_1 = require("./FirestoreUtils");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)({ origin: '*' }));
// Parse JSON body
app.use(express_1.default.json());
// Initialize Firebase Admin SDK
const serviceAccountPath = path_1.default.join(__dirname, '../res/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const firestoreUtils = new FirestoreUtils_1.FirestoreUtils(db);
// Register a user (GET request, just like before)
// app.get('/register', async (req: any, res: any) => {
//   try {
//     const username: any = req.query.username;
//     const password: any = req.query.password;
//     if (!username || !password) {
//       return res.status(400).send({ error: 'Username and password are required' });
//     }
//     // Check if username is taken by querying Firestore
//     const usersRef = db.collection('users');
//     const userSnapshot = await usersRef.where('username', '==', username).get();
//     if (!userSnapshot.empty) {
//       return res.status(400).send({ error: 'Username is already taken' });
//     }
//     // Username not taken, create new user
//     const newUserRef = usersRef.doc();
//     await newUserRef.set({
//       username,
//       password
//     });
//     console.log("Wrote user to Firestore with ID:", newUserRef.id);
//     res.status(201).send({ message: 'Registration successful', userId: newUserRef.id });
//   } catch (error) {
//     res.status(500).send({ error: 'Internal server error' });
//   }
// });
app.post('/set-user-type', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userType, userId, authenticated } = req.body;
        console.log('Request Body:', req.body);
        // Validate the 'authenticated' flag
        if (!authenticated) {
            return res.status(403).json({ error: 'User is not authenticated' });
        }
        // Validate userType
        const allowedTypes = ['student', 'tutor', 'parent'];
        if (!allowedTypes.includes(userType)) {
            return res.status(400).json({ error: 'Invalid user type' });
        }
        // Validate userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Simulate updating the user type in Firestore
        console.log(`Updating user ${userId} to type: ${userType}`);
        const userRef = db.collection('users').doc(userId);
        yield userRef.set({ userType }, { merge: true });
        res.status(200).json({ message: `User type updated to ${userType}` });
    }
    catch (error) {
        console.error('Error setting user type:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Get progress data
app.get('/get-progress-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userType = req.query.userType; // userType passed in the request
        const userId = req.query.userId; // userId passed in the request
        // Validate input parameters
        if (typeof userType !== 'string' || userType === '') {
            return res.status(400).send('User type is a required string');
        }
        if (typeof userId !== 'string' || userId === '') {
            return res.status(400).send('User ID is a required string');
        }
        // Allow only students to access the endpoint
        if (userType !== 'student') {
            return res.status(403).send('Access denied: Only students can get progress data');
        }
        // Fetch user progress from Firestore
        const firestoreRes = yield firestoreUtils.getUserProgress(userId);
        if (firestoreRes.type === 'unauthorized') {
            return res.status(401).send(`User type '${userType}' is unauthorized to access user '${userId}' progress`);
        }
        else if (firestoreRes.type === 'success') {
            return res.status(200).send(firestoreRes.data);
        }
        else {
            return res.status(500).send('Error fetching data: ' + firestoreRes.details);
        }
    }
    catch (error) {
        console.error("Error sending progress data:", error);
        return res.status(500).send('Error fetching data');
    }
}));
// Get recommendation (still mock for now)
app.get('/get-recommendation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.query.question_id;
        const userId = req.query.user_id;
        if (typeof questionId !== 'string' || questionId === '') {
            return res.status(400).send('Question ID is a required string');
        }
        else if (typeof userId !== 'string' || userId === '') {
            return res.status(400).send('User ID is a required string');
        }
        const questionResponse = yield firestoreUtils.getUserProgress(userId);
        if (questionResponse.type !== 'success' || !questionResponse.data) {
            return res.status(500).send('Error fetching user progress: could not get previous questions');
        }
        // I only changed local host to 127.0.0.1 works only works for xiuyuan
        const response = yield axios_1.default.post('http://127.0.0.1:3001/get-recommendation-from-tensor', {
            question_id: questionId,
            prev_questions: questionResponse.data,
        }, {
            validateStatus: (status) => (status === 200 || status === 400)
        });
        if (response.status !== 200 && response.data.error === "question not in dataset") {
            return res.status(404).send('Question ID not found');
        }
        else if (response.status !== 200) {
            return res.status(500).send('Error fetching recommendation: ' + response.data.error);
        }
        const modelResponse = response.data;
        // I modified this code only works for xiuyuan
        // console.log(modelResponse);
        const recommendations = modelResponse.map((rec) => {
            const question = satDataset.math.find((q) => q.id === rec.id) || satDataset.english.find((q) => q.id === rec.id);
            return {
                question
            };
        });
        res.status(200).send({ recommendation: recommendations });
    }
    catch (error) {
        console.log("Error getting recommendation: ", error);
        res.status(500).send('Error fetching data');
    }
}));
// Load SAT dataset
const satDatasetPath = path_1.default.join(__dirname, '../src/sat_dataset.json');
const satDataset = JSON.parse(fs_1.default.readFileSync(satDatasetPath, 'utf8'));
app.get('/get-random-questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.user_id;
        let numQuestions = req.query.num_questions;
        if (!numQuestions) {
            numQuestions = 10;
        }
        if (typeof userId !== 'string' || userId === '') {
            return res.status(400).send('User ID is a required string');
        }
        const questionResponse = yield firestoreUtils.getUserProgress(userId);
        if (questionResponse.type !== 'success' || !questionResponse.data) {
            return res.status(500).send('Error fetching user progress: could not get previous questions');
        }
        const answeredQuestionIds = questionResponse.data.map((q) => q.questionId);
        const mathQuestions = satDataset.math.filter((q) => !answeredQuestionIds.includes(q.id));
        const englishQuestions = satDataset.english.filter((q) => !answeredQuestionIds.includes(q.id));
        if (!mathQuestions || !englishQuestions) {
            return res.status(500).send('Error loading questions');
        }
        const getRandomQuestions = (questions, count) => {
            const shuffled = questions.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };
        const randomMathQuestions = getRandomQuestions(mathQuestions, numQuestions);
        const randomEnglishQuestions = getRandomQuestions(englishQuestions, numQuestions);
        const randomQuestions = [...randomMathQuestions, ...randomEnglishQuestions];
        res.status(200).send(randomQuestions);
    }
    catch (error) {
        console.log("Error getting random questions: ", error);
        res.status(500).send('Error getting random questions');
    }
}));
app.post('/update-progress-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const questionId = req.body.questionId;
        const correctAnswer = req.body.correctAnswer;
        const answerChosen = req.body.answerChosen;
        const correct = req.body.correct;
        if (typeof questionId !== 'string' || questionId === '') {
            return res.status(400).send('Question ID is a required string');
        }
        else if (typeof correct !== 'boolean') {
            return res.status(400).send('Correct must be a boolean');
        }
        const firestoreRes = yield firestoreUtils.updateStudentProgress(userId, questionId, correctAnswer, answerChosen, correct);
        if (firestoreRes.type === 'success') {
            res.status(200).send('Progress updated successfully');
        }
        else {
            res.status(500).send('Error updating data: ' + firestoreRes.details);
        }
    }
    catch (error) {
        console.log("Error updating progress data: ", error);
        res.status(500).send('Error updating data');
    }
}));
app.get('/get-student-accuracy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const timeframe = req.query.timeframe;
        if (!userId || !timeframe) {
            return res.status(400).send('User ID and timeframe are required');
        }
        const firestoreRes = yield firestoreUtils.getStudentAccuracy(userId, timeframe);
        if (firestoreRes.type === 'success') {
            res.status(200).send(firestoreRes.data);
        }
        else {
            res.status(500).send('Error fetching accuracy: ' + firestoreRes.details);
        }
    }
    catch (error) {
        console.error('Error fetching student accuracy:', error);
        res.status(500).send('Internal server error');
    }
}));
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
exports.default = app;
//
