import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignIn, useUser } from '@clerk/clerk-react';
import QuestionView from './QuestionView';
import ProgressView from './ProgressView';
import NavigationButton from './NavigationButton';

function App() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="py-4 flex justify-center">
            <NavigationButton />
          </div>
          <Routes>
            <Route path="/question" element={<QuestionView userId={user.id} />} />
            <Route path="/progress" element={<ProgressView userId={user.id} />} />
            <Route path="*" element={<Navigate to="/question" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
