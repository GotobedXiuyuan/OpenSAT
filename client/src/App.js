import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SignIn, useUser, useAuth } from "@clerk/clerk-react";
import ProgressView from "./ProgressView";
import QuestionView from "./QuestionView";
import NavigationButton from "./NavigationButton";

function App() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

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
          {/* Navigation and Logout */}
          <div className="py-4 flex justify-between items-center">
            <NavigationButton />
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
          </div>
          {/* Routes */}
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
