"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreUtils = void 0;
class FirestoreUtils {
    constructor(db) {
        this.firestore = db;
    }
    updateStudentProgress(userId, questionId, correctAnswer, answerChosen, correct) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionRef = this.firestore
                    .collection('users')
                    .doc(userId)
                    .collection('questions');
                yield questionRef.add({
                    questionId,
                    answered: new Date(),
                    answerChosen,
                    correctAnswer,
                    correct
                });
                return {
                    type: 'success',
                    data: null,
                    details: 'Question progress updated successfully'
                };
            }
            catch (error) {
                return {
                    type: 'failure',
                    data: null,
                    details: `Error updating question progress: ${error.message}`
                };
            }
        });
    }
    getUserProgress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionsRef = this.firestore
                    .collection('users')
                    .doc(userId)
                    .collection('questions');
                const questionsSnapshot = yield questionsRef.get();
                const questions = questionsSnapshot.docs.map(doc => doc.data());
                return {
                    type: 'success',
                    data: questions,
                    details: 'User progress retrieved successfully'
                };
            }
            catch (error) {
                return {
                    type: 'failure',
                    data: null,
                    details: `Error retrieving user progress: ${error.message}`
                };
            }
        });
    }
    getStudentAccuracy(userId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const startDate = new Date();
                // Calculate start date based on timeframe
                if (timeframe === 'week') {
                    startDate.setDate(now.getDate() - 7);
                }
                else if (timeframe === 'month') {
                    startDate.setMonth(now.getMonth() - 1);
                }
                const questionsRef = this.firestore
                    .collection('users')
                    .doc(userId)
                    .collection('questions');
                const snapshot = yield questionsRef
                    .where('answered', '>=', startDate)
                    .get();
                if (snapshot.empty) {
                    return {
                        type: 'success',
                        data: { averageAccuracy: 0 },
                        details: 'No questions found for the given timeframe',
                    };
                }
                // Calculate accuracy
                let correctAnswers = 0;
                let totalQuestions = 0;
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.correct !== undefined) {
                        totalQuestions += 1;
                        if (data.correct) {
                            correctAnswers += 1;
                        }
                    }
                });
                const averageAccuracy = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;
                return {
                    type: 'success',
                    data: { averageAccuracy },
                    details: 'Student accuracy calculated successfully',
                };
            }
            catch (error) {
                return {
                    type: 'failure',
                    data: null,
                    details: `Error calculating student accuracy: ${error.message}`,
                };
            }
        });
    }
}
exports.FirestoreUtils = FirestoreUtils;
exports.default = FirestoreUtils;
