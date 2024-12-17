const API_URL = 'http://localhost:3001';
const FIREBASE_API_URL = '/api/firebase';

export const getRecommendations = async (questionId, prevQuestions, topN = 3) => {
  try {
    const response = await fetch(`${API_URL}/get-recommendation-from-tensor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionId,
        prev_questions: prevQuestions,
        top_n: topN
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const updateProgress = async (userId, questionId, correctAnswer, answerChosen, correct) => {
  try {
    const response = await fetch(`${FIREBASE_API_URL}/updateStudentProgress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        questionId,
        correctAnswer,
        answerChosen,
        correct
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const getUserProgress = async (userId) => {
  try {
    const response = await fetch(`${FIREBASE_API_URL}/getUserProgress/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const getAccuracy = async (userId, timeframe) => {
  try {
    const response = await fetch(`${FIREBASE_API_URL}/getStudentAccuracy/${userId}/${timeframe}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching accuracy:', error);
    throw error;
  }
};