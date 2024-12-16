import express from 'express';
import * as admin from 'firebase-admin';
import { FirestoreUtils, FirestoreUtilResponse } from './FirestoreUtils';
import path from 'path';

const app = express();
const port = 3000;

// Parse JSON body (for POST requests)
app.use(express.json());

// Load service account key
const serviceAccountPath = path.join(__dirname, '../res/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);
import axios from 'axios';
import fs from 'fs';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Instantiate FirestoreUtils with the Firestore instance
const firestoreUtils = new FirestoreUtils(db);


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

// Get progress data

app.get('/get-progress-data', async (req: any, res: any) => {
  try {
    const userType: any = req.query.userType;
    const userId: any = req.query.userId;

    if (typeof userType !== 'string' || userType === '') {
      return res.status(400).send('User type is a required string');
    } 
    if (typeof userId !== 'string' || userId === '') {
      return res.status(400).send('User ID is a required string');
    }

    // Use FirestoreUtils to get actual data from Firestore
    const firestoreRes: FirestoreUtilResponse = await firestoreUtils.getUserProgress(userId);

    if (firestoreRes.type === 'unauthorized') {
      res.status(401).send("User type " + userType + " is unauthorized to access user " + userId + "'s progress");
    } else if (firestoreRes.type === 'success') {
      res.status(200).send(firestoreRes.data);
    } else {
      res.status(500).send('Error fetching data: ' + firestoreRes.details);
    }
  } catch (error) {
    console.log("Error sending progress data: ", error);
    res.status(500).send('Error fetching data');
  }
});

// Get recommendation (still mock for now)

app.get('/get-recommendation', async (req: any, res: any) => {
  try {
    const questionId: any = req.query.question_id;
    const userId: any = req.query.user_id

    if (typeof questionId !== 'string' || questionId === '') {
      return res.status(400).send('Question ID is a required string');
    } else if (typeof userId !== 'string' || userId === '') {
      return res.status(400).send('User ID is a required string');
    }

    const questionResponse: FirestoreUtilResponse = await firestoreUtils.getUserProgress(userId);
    if (questionResponse.type !== 'success' || !questionResponse.data) {
      return res.status(500).send('Error fetching user progress: could not get previous questions');
    }

    const response = await axios.post('http://localhost:3001/get-recommendation-from-tensor', {
      question_id: questionId,
      prev_questions: questionResponse.data,
    }, {
      validateStatus: (status: number) => (status === 200 || status === 400)
    });

    if (response.status !== 200 && response.data.error === "question not in dataset") {
      return res.status(404).send('Question ID not found');
    } else if (response.status !== 200) {
      return res.status(500).send('Error fetching recommendation: ' + response.data.error);
    }

    const modelResponse = response.data;
    const recommendations = modelResponse.recommendation.map((rec: any) => {
      const question = satDataset.math.find((q: any) => q.id === rec.id) || satDataset.english.find((q: any) => q.id === rec.id);
      return {
      ...rec,
      question: question ? question : null
      };
    });

    res.status(200).send({ recommendation: recommendations });
  } catch (error) {
    console.log("Error getting recommendation: ", error);
    res.status(500).send('Error fetching data');
  }
});

// Load SAT dataset
const satDatasetPath = path.join(__dirname, '../src/sat_dataset.json');
const satDataset = JSON.parse(fs.readFileSync(satDatasetPath, 'utf8'));


app.get('/get-random-questions', async (req: any, res: any) => {
  try {
    const userId: any = req.query.user_id;

    if (typeof userId !== 'string' || userId === '') {
      return res.status(400).send('User ID is a required string');
    }

    const questionResponse: FirestoreUtilResponse = await firestoreUtils.getUserProgress(userId);
    if (questionResponse.type !== 'success' || !questionResponse.data) {
      return res.status(500).send('Error fetching user progress: could not get previous questions');
    }

    const answeredQuestionIds = questionResponse.data.map((q: any) => q.questionId);

    const mathQuestions = satDataset.math.filter((q: any) => !answeredQuestionIds.includes(q.id));
    const englishQuestions = satDataset.english.filter((q: any) => !answeredQuestionIds.includes(q.id));

    if (!mathQuestions || !englishQuestions) {
      return res.status(500).send('Error loading questions');
    }

    const getRandomQuestions = (questions: any[], count: number) => {
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const randomMathQuestions = getRandomQuestions(mathQuestions, 10);
    const randomEnglishQuestions = getRandomQuestions(englishQuestions, 10);

    const randomQuestions = [...randomMathQuestions, ...randomEnglishQuestions];

    res.status(200).send(randomQuestions);
  } catch (error) {
    console.log("Error getting random questions: ", error);
    res.status(500).send('Error getting random questions');
  }
});

app.post('/update-progress-data', async (req: any, res: any) => {
  try {
    const userId: any = req.body.userId;
    const questionId: any = req.body.questionId;
    const correctAnswer: any = req.body.correctAnswer;
    const answerChosen: any = req.body.answerChosen;
    const correct: any = req.body.correct;

    if (typeof questionId !== 'string' || questionId === '') {
      return res.status(400).send('Question ID is a required string');
    } else if (typeof correct !== 'boolean') {
      return res.status(400).send('Correct must be a boolean');
    }

    const firestoreRes: FirestoreUtilResponse = await firestoreUtils.updateStudentProgress(
      userId,
      questionId,
      correctAnswer,
      answerChosen,
      correct
    );

    if (firestoreRes.type === 'success') {
      res.status(200).send('Progress updated successfully');
    } else {
      res.status(500).send('Error updating data: ' + firestoreRes.details);
    }
  } catch (error) {
    console.log("Error updating progress data: ", error);
    res.status(500).send('Error updating data');
  }
});
app.get('/get-student-accuracy', async (req: any, res: any) => {
  try {
      const userId: string = req.query.userId as string;
      const timeframe: 'week' | 'month' = req.query.timeframe as 'week' | 'month';

      if (!userId || !timeframe) {
          return res.status(400).send('User ID and timeframe are required');
      }

      const firestoreRes = await firestoreUtils.getStudentAccuracy(userId, timeframe);

      if (firestoreRes.type === 'success') {
          res.status(200).send(firestoreRes.data);
      } else {
          res.status(500).send('Error fetching accuracy: ' + firestoreRes.details);
      }
  } catch (error) {
      console.error('Error fetching student accuracy:', error);
      res.status(500).send('Internal server error');
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
//