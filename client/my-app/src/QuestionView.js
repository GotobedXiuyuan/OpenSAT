import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getRandomQuestions, getRecommendations, updateProgress } from './apiUtils';

const QuestionView = ({ userId }) => {
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentRecommendedQuestionInd, setCurrentRecommendedQuestionInd] = useState(0);

  useEffect(() => {
    const getFirstQuestion = async () => {
      try {
        const randomQuestion = await getRandomQuestions(userId, 1);
        setQuestionData(randomQuestion[0]);
      } catch (error) {
        console.error('Error fetching initial question:', error);
      }
    };

    getFirstQuestion();
  }, [userId]);

  const handleChoiceClick = async (choice) => {
    if (isAnswered || !questionData) return;
    
    setSelectedChoice(choice);
    setIsAnswered(true);

    try {
      const correctAnswer = questionData.question.choices[questionData.question.correct_answer];
      await updateProgress(
        userId,
        questionData.id,
        correctAnswer,
        choice.text,
        choice.isCorrect
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    setSelectedChoice(null);
    setIsAnswered(false);

    try {
      if (recommendedQuestions.length === 0 || currentRecommendedQuestionInd === recommendedQuestions.length - 1) {
        const data = await getRecommendations(userId, questionData.id);
        setRecommendedQuestions(data.recommendation);
        setCurrentRecommendedQuestionInd(0);
        setQuestionData(data.recommendation[0].question);
      } else {
        setQuestionData(recommendedQuestions[currentRecommendedQuestionInd + 1].question);
        setCurrentRecommendedQuestionInd(currentRecommendedQuestionInd + 1);
      }
    } catch (error) {
      console.error('Error getting next question:', error);
      const randomQuestion = await getRandomQuestions(userId, 1);
      setQuestionData(randomQuestion[0]);
    }
    
    setLoading(false);
  };

  const getChoiceStyle = (choice) => {
    if (selectedChoice && selectedChoice.id === choice.id) {
      return choice.isCorrect 
        ? "bg-green-100 border-green-500 text-green-800" 
        : "bg-red-100 border-red-500 text-red-800";
    }
    return "bg-white hover:bg-blue-50 border-blue-200";
  };

  if (loading || !questionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const isEnglishQuestion = questionData.domain === "Standard English Conventions" || 
                          questionData.domain === "Expression of Ideas" || 
                          questionData.domain === "Craft and Structure" ||
                          questionData.domain === "Information and Ideas";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto grid gap-6">
        {isEnglishQuestion && questionData.question.paragraph && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Passage</h2>
            <div className="h-48 overflow-y-auto prose">
              {questionData.question.paragraph}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-2xl font-bold text-gray-800 mb-4">
            Practice Question
          </div>
          
          <div className="text-xl font-semibold text-gray-700 mb-6">
            {questionData.question.question}
          </div>
          
          <div className="space-y-4">
            {Object.entries(questionData.question.choices).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleChoiceClick({ 
                  id: key, 
                  text: value, 
                  isCorrect: key === questionData.question.correct_answer 
                })}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                  ${getChoiceStyle({ id: key, text: value, isCorrect: key === questionData.question.correct_answer })}
                  ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                disabled={isAnswered}
              >
                <div className="flex justify-between items-center">
                  <span>{value}</span>
                  {selectedChoice && selectedChoice.id === key && (
                    key === questionData.question.correct_answer 
                      ? <CheckCircle className="text-green-600" />
                      : <XCircle className="text-red-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {isAnswered && questionData.question.explanation && (
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mt-4">
              <h3 className="font-bold text-blue-800 mb-2">Explanation:</h3>
              <p className="text-blue-700">{questionData.question.explanation}</p>
            </div>
          )}

        {recommendedQuestions.length > 0 && isAnswered && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">Recommended Questions:</h3>
            <div className="space-y-2">
              {recommendedQuestions.map((rec) => (
                <div key={rec.id} className="p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Question {rec.id}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    (Similarity: {(rec.similarity * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

          {isAnswered && (
            <button 
              onClick={handleNext}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionView;