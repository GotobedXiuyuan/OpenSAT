import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getRecommendations, updateProgress } from './apiUtils';

const QuestionView = ({ userId, currentQuestionId }) => {
  const [questionData, setQuestionData] = useState({
    question: "Solve for X: 3x + 5 = 20?",
    choices: [
      { id: 1, text: "5", isCorrect: true },
      { id: 2, text: "3", isCorrect: false },
      { id: 3, text: "4", isCorrect: false },
      { id: 4, text: "6", isCorrect: false }
    ],
    explanation: "Insert explanation text here"
  });

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [prevQuestions, setPrevQuestions] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await getRecommendations(currentQuestionId, prevQuestions);
        setRecommendedQuestions(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    if (currentQuestionId) {
      fetchRecommendations();
    }
  }, [currentQuestionId, prevQuestions]);

  const handleChoiceClick = async (choice) => {
    setSelectedChoice(choice);
    
    if (!choice.isCorrect) {
      setShowExplanation(true);
    }

    try {
      await updateProgress(
        userId,
        currentQuestionId,
        questionData.choices.find(c => c.isCorrect).text,
        choice.text,
        choice.isCorrect
      );

      setPrevQuestions(prev => [...prev, {
        questionId: currentQuestionId,
        correct: choice.isCorrect
      }]);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getChoiceStyle = (choice) => {
    if (selectedChoice && selectedChoice.id === choice.id) {
      return choice.isCorrect 
        ? "bg-green-100 border-green-500 text-green-800" 
        : "bg-red-100 border-red-500 text-red-800";
    }
    return "bg-white hover:bg-blue-50 border-blue-200";
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-8 space-y-6">
        <div className="text-2xl font-bold text-gray-800 mb-4">
          Practice Question
        </div>
        
        <div className="text-xl font-semibold text-gray-700 mb-6">
          {questionData.question}
        </div>
        
        <div className="space-y-4">
          {questionData.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoiceClick(choice)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                ${getChoiceStyle(choice)}
                ${selectedChoice ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={!!selectedChoice}
            >
              <div className="flex justify-between items-center">
                <span>{choice.text}</span>
                {selectedChoice && selectedChoice.id === choice.id && (
                  choice.isCorrect 
                    ? <CheckCircle className="text-green-600" />
                    : <XCircle className="text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mt-4">
            <h3 className="font-bold text-blue-800 mb-2">Explanation:</h3>
            <p className="text-blue-700">{questionData.explanation}</p>
          </div>
        )}
        
        {selectedChoice && !selectedChoice.isCorrect && (
          <button 
            onClick={toggleExplanation}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {showExplanation ? 'Hide Explanation' : 'View Explanation'}
          </button>
        )}

        {recommendedQuestions.length > 0 && selectedChoice && (
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
      </div>
    </div>
  );
};

export default QuestionView;