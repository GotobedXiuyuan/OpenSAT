import React, { useState, useEffect } from 'react';
import { getUserProgress, getAccuracy } from './apiUtils';

const ProgressView = ({ userId }) => {
  const [quizResults, setQuizResults] = useState({
    totalQuestions: 0,
    correctQuestions: 0,
    incorrectQuestions: 0
  });
  const [weeklyAccuracy, setWeeklyAccuracy] = useState(0);
  const [monthlyAccuracy, setMonthlyAccuracy] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const progressResponse = await getUserProgress(userId);
        const questions = progressResponse;
        const correct = questions.filter(q => q.correct).length;
        setQuizResults({
          totalQuestions: questions.length,
          correctQuestions: correct,
          incorrectQuestions: questions.length - correct
        });

        const weeklyResponse = await getAccuracy(userId, 'week');
        if (weeklyResponse.type === 'success') {
          setWeeklyAccuracy(weeklyResponse.data.averageAccuracy);
        }

        const monthlyResponse = await getAccuracy(userId, 'month');
        if (monthlyResponse.type === 'success') {
          setMonthlyAccuracy(monthlyResponse.data.averageAccuracy);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const getMotivationalMessage = (accuracy) => {
    if (accuracy >= 90) return "Excellent work! You're SAT ready!";
    if (accuracy >= 80) return "Great job! Keep pushing your limits!";
    if (accuracy >= 70) return "Good progress. Stay focused!";
    if (accuracy >= 60) return "You're improving. Don't give up!";
    return "Keep practicing. Every mistake is a learning opportunity!";
  };

  const accuracy = quizResults.totalQuestions === 0 ? 0 : 
    ((quizResults.correctQuestions / quizResults.totalQuestions) * 100).toFixed(1);
  const motivationalMessage = getMotivationalMessage(parseFloat(accuracy));

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h1 className="text-2xl font-bold mb-6">Progress Report</h1>

        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <div className="space-y-2">
              <div className="text-lg">Total Questions: {quizResults.totalQuestions}</div>
              <div className="text-green-600">Correct: {quizResults.correctQuestions}</div>
              <div className="text-red-600">Incorrect: {quizResults.incorrectQuestions}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Overall Accuracy: {accuracy}%</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Weekly Accuracy: {weeklyAccuracy.toFixed(1)}%</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${weeklyAccuracy}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Monthly Accuracy: {monthlyAccuracy.toFixed(1)}%</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${monthlyAccuracy}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-800 font-medium">
          {motivationalMessage}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;