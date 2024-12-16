import React, { useState, useEffect } from 'react';

const ProgressView = () => {


  const [quizResults, setQuizResults] = useState({
    totalQuestions: 25,
    correctQuestions: 18,
    incorrectQuestions: 7
  });


  const getMotivationalMessage = (accuracy) => {
    if (accuracy >= 90) return "Excellent work! You're SAT ready!";
    if (accuracy >= 80) return "Great job! Keep pushing your limits!";
    if (accuracy >= 70) return "Good progress. Stay focused!";
    if (accuracy >= 60) return "You're improving. Don't give up!";
    return "Keep practicing. Every mistake is a learning opportunity!";
  };

  const accuracy = ((quizResults.correctQuestions / quizResults.totalQuestions) * 100).toFixed(1);
  const motivationalMessage = getMotivationalMessage(parseFloat(accuracy));

  return (
    <div style={{
      backgroundColor: '#6a11cb',
      background: 'linear-gradient(to right, #2575fc, #6a11cb)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '30px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
          Performance Metrics
        </h1>

        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '20px' 
        }}>
          <div>
            <h3>Correct</h3>
            <p style={{ 
              color: 'lightgreen', 
              fontSize: '24px', 
              fontWeight: 'bold' 
            }}>
              {quizResults.correctQuestions}
            </p>
          </div>
          <div>
            <h3>Incorrect</h3>
            <p style={{ 
              color: 'lightcoral', 
              fontSize: '24px', 
              fontWeight: 'bold' 
            }}>
              {quizResults.incorrectQuestions}
            </p>
          </div>
        </div>

        <div style={{ 
          width: '100%', 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: '10px', 
          marginBottom: '20px' 
        }}>
          <div style={{
            width: `${accuracy}%`,
            height: '20px',
            backgroundColor: accuracy >= 70 ? 'lightgreen' : 'orange',
            borderRadius: '10px',
            transition: 'width 0.5s ease-in-out'
          }}/>
        </div>

        <div style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '15px' 
        }}>
          {accuracy}%
        </div>

        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          padding: '15px', 
          borderRadius: '10px' 
        }}>
          {motivationalMessage}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;