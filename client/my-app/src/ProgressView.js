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
       if (progressResponse.type === 'success') {
         const questions = progressResponse.data;
         const correct = questions.filter(q => q.correct).length;
         setQuizResults({
           totalQuestions: questions.length,
           correctQuestions: correct,
           incorrectQuestions: questions.length - correct
         });
       }

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
     <div className="bg-white p-4 rounded w-96">
       <h1 className="text-xl font-bold mb-4">Progress Report</h1>

       <div className="mb-4">
         <div className="flex justify-between mb-2">
           <div>
             <div>Correct: {quizResults.correctQuestions}</div>
             <div>Incorrect: {quizResults.incorrectQuestions}</div>
           </div>
         </div>
       </div>

       <div className="mb-4">
         <div>
           <h3>Overall Accuracy: {accuracy}%</h3>
           <div className="w-full bg-gray-200 h-2">
             <div 
               className="bg-blue-500 h-2"
               style={{ width: `${accuracy}%` }}
             />
           </div>
         </div>

         <div className="mt-2">
           <h3>Weekly: {weeklyAccuracy.toFixed(1)}%</h3>
           <div className="w-full bg-gray-200 h-2">
             <div 
               className="bg-blue-500 h-2"
               style={{ width: `${weeklyAccuracy}%` }}
             />
           </div>
         </div>

         <div className="mt-2">
           <h3>Monthly: {monthlyAccuracy.toFixed(1)}%</h3>
           <div className="w-full bg-gray-200 h-2">
             <div 
               className="bg-blue-500 h-2"
               style={{ width: `${monthlyAccuracy}%` }}
             />
           </div>
         </div>
       </div>

       <div className="border-t pt-2">
         {motivationalMessage}
       </div>
     </div>
   </div>
 );
};

export default ProgressView;