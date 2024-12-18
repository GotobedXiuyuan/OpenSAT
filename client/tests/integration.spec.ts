import { test, expect } from '@playwright/test';
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright';
import { clerkSetup } from '@clerk/testing/playwright';

test.describe('Integration Tests for ProgressView and QuestionView', () => {
  // Set up Clerk and navigate to the app
  test.beforeEach(async ({ page }) => {
    await clerkSetup({
      CLERK_SECRET_KEY: 'sk_test_dLSNQePmD9QR7YrivnLbeECwxivReKdBY0acQVowaa',
    });
    setupClerkTestingToken({ page });

    await page.goto('http://localhost:3000');
    await clerk.loaded({ page });

    // Sign in
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'test42@brown.edu',
        password: 'Wxy20020624!',
      },
    });
  });

  test('ProgressView displays correct user data', async ({ page }) => {
    // Navigate to ProgressView
    await page.goto('http://localhost:3000/progress');

    // Wait for progress data to load
    const totalQuestions = page.locator('text=Total Questions:');
    const overallAccuracy = page.locator('text=Overall Accuracy:');

   
    await expect(totalQuestions).toBeVisible();
    await expect(overallAccuracy).toBeVisible();


    const weeklyAccuracy = page.locator('text=Weekly Accuracy:');
    const monthlyAccuracy = page.locator('text=Monthly Accuracy:');

    await expect(weeklyAccuracy).toBeVisible();
    await expect(monthlyAccuracy).toBeVisible();
  });

  test('QuestionView displays and processes questions', async ({ page }) => {
    // Intercept the backend response
    await page.route('**/get-random-questions?**', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            domain: 'Standard English Conventions',
            question: {
              question: 'What is the correct answer?',
              choices: {
                A: 'Option 1',
                B: 'Option 2',
                C: 'Option 3',
                D: 'Option 4',
              },
              correct_answer: 'A',
              explanation: 'Option 1 is correct because it aligns with the rules.',
            },
          },
        ]),
      })
    );
  
    // Navigate to QuestionView
    await page.goto('http://localhost:3000/question');
  
    // Wait for question to load
    const questionText = page.locator('text=Practice Question');
    await expect(questionText).toBeVisible();
  
    // Verify the choices are visible
    const choices = page.locator('button span');
    await expect(choices).toHaveCount(4); // Assuming 4 choices
  
    // Select the first choice
    await choices.first().click();
  
    // Verify feedback is displayed
    const explanation = page.locator('text=Explanation:');
    await expect(explanation).toBeVisible();
  
    // Move to the next question
    const nextButton = page.locator('button:has-text("Next Question")');
    await nextButton.click();
  
    // Verify the new question is loaded
    await expect(questionText).toBeVisible();
  });
  test('ProgressView displays user progress correctly with regex', async ({ page }) => {
    // Mock API response for user progress
    await page.route('**/api/progress/**', (route) =>
      route.fulfill({
        status: 200,
        body: [
          { correct: true },
          { correct: false },
          { correct: true },
        ],
      })
    );
  
    // Mock API responses for accuracy
    await page.route('**/api/accuracy/**?period=week', (route) =>
      route.fulfill({
        status: 200,
        body: { averageAccuracy: 75.5 },
      })
    );
  
    await page.route('**/api/accuracy/**?period=month', (route) =>
      route.fulfill({
        status: 200,
        body: { averageAccuracy: 80.0 },
      })
    );
  
    // Navigate to the ProgressView page
    await page.goto('http://localhost:3000/progress');
  
    // Extract text content and use regex to validate
    const correctQuestionsText = await page.locator('div.text-green-600').textContent();
    expect(correctQuestionsText).toMatch(/Correct: \d+/);
  
    const incorrectQuestionsText = await page.locator('div.text-red-600').textContent();
    expect(incorrectQuestionsText).toMatch(/Incorrect: \d+/);
  });
  

});