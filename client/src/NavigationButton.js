import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NavigationButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isQuestionView = location.pathname === '/question';

  return (
    <button
      onClick={() => navigate(isQuestionView ? '/progress' : '/question')}
      className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full backdrop-blur-lg transition-all duration-300"
    >
      Switch to {isQuestionView ? 'Progress' : 'Question'} View
    </button>
  );
}

export default NavigationButton;