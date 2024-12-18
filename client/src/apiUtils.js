const API_URL = 'http://localhost:4000';

export const getRandomQuestions = async (userId, numQuestions) => {
  try {
    const response = await fetch(`${API_URL}/get-random-questions?user_id=${userId}&num_questions=${numQuestions}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting random questions:', error);
    throw error;
  }
}

export const getRecommendations = async (userId, questionId) => {
  try {
    const response = await fetch(`${API_URL}/get-recommendation?user_id=${userId}&question_id=${questionId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const updateProgress = async (userId, questionId, correctAnswer, answerChosen, correct) => {
  try {
    const response = await fetch(`${API_URL}/update-progress-data`, {
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
    const response = await fetch(`${API_URL}/get-progress-data?userId=${userId}&userType=student`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const getAccuracy = async (userId, timeframe) => {
  try {
    const response = await fetch(`${API_URL}/get-student-accuracy?userId=${userId}&timeframe=${timeframe}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching accuracy:', error);
    throw error;
  }
};