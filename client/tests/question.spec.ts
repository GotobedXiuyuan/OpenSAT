import { test, expect } from '@playwright/test';
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright';
import { clerkSetup } from '@clerk/testing/playwright';

test.describe('Frontend Tests for Question and Progress Views', () => {
  // Set up authentication before each test
  test.beforeEach(async ({ page }) => {
    await clerkSetup({
      // CLERK_SECRET_KEY: 'sk_test_dLSNQePmD9QR7YrivnLbeECwxivReKdBY0acQVowaa',
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

  test('QuestionView displays all UI elements correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/question');
    
    // Check main UI elements are visible
    await expect(page.locator('text=Practice Question')).toBeVisible();
    await expect(page.locator('button:has-text("Switch to Progress View")')).toBeVisible();
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    
    // Check navigation works
    const navButton = page.locator('button:has-text("Switch to Progress View")');
    await navButton.click();
    await expect(page).toHaveURL('http://localhost:3000/progress');
  });

  test('ProgressView displays all UI elements correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/progress');
    
    // Check main UI elements are visible
    await expect(page.locator('text=Progress Report')).toBeVisible();
    await expect(page.locator('text=Total Questions:')).toBeVisible();
    await expect(page.locator('text=Overall Accuracy:')).toBeVisible();
    await expect(page.locator('text=Weekly Accuracy:')).toBeVisible();
    await expect(page.locator('text=Monthly Accuracy:')).toBeVisible();
    
    // Check navigation works
    const navButton = page.locator('button:has-text("Switch to Question View")');
    await expect(navButton).toBeVisible();
    await navButton.click();
    await expect(page).toHaveURL('http://localhost:3000/question');
  });

  test('Question View navigation and logout buttons work', async ({ page }) => {
    await page.goto('http://localhost:3000/question');
    
    // Test navigation button toggle
    const navButton = page.locator('button:has-text("Switch to Progress View")');
    await navButton.click();
    await expect(page).toHaveURL('http://localhost:3000/progress');
    
    // Test logout button
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();
    
    // After logout, should see sign in element
    await expect(page.locator('text=Sign in')).toBeVisible();
  });
});