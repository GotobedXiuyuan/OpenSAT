# OpenSAT

This is the final project of @erikv05, @GotobedXiuyuan, and @SaiMandhan for [CSCI 0320 @ Brown](https://cs0320.github.io/).

## Problem

We notice that standardized testing, particularly the SAT, is (1) something that almost all students will have to study for, (2) something in which higher-income students traditionally perform better, and (3) a problem needing a tailored solution rather than a 'one-size-fits-all' solution. Because of (1), we try to address (2) and (3) with OpenSAT.

## Description

Our application allows users to work through a bank of roughly 2,000 real SAT questions to improve their SAT performance; they can also track their performance over time. We built a recommendation system using Google's [BERT](https://research.google/pubs/bert-pre-training-of-deep-bidirectional-transformers-for-language-understanding/) which recommends similar questions to those for which the student performs worse. The application starts by presenting random questions that the student hasn't answered and then caches recommendations from the back-end. Answered questions are stored so that the student is always presented with new questions.

## Implementation

We use Clerk for authentication, React + Tailwind CSS for the front-end, Express.js for the backend, jest for testing, and Firestore for persistent storage. We also hosted another HTTP server to communicate with the recommendation system, stored using python.

## Testing

We split the test suite into separate tests for integration, front-end, and back-end. We used jest + supertest and mocked back-end data.

## Known Bugs

As of now, LaTeX is not rendered for the math questions: we are looking in to coming up with a rendering system for all the questions in the bank rather than using arbitrary rendering.
