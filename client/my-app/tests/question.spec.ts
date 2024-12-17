import { test, expect } from '@playwright/test';

test.describe('Question View Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page and sign in
    await page.goto('http://localhost:3000');
    // You'll need to modify this based on your actual auth flow
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.fill('input[name="email"]', 'notreal3@brown.edu');
    await page.fill('input[name="password"]', 'notrealnotreal');
    await page.click('button[type="submit"]');
    // Wait for the question page to load
    await page.waitForSelector('.text-2xl');
  });

  test('shows green feedback for correct answer', async ({ page }) => {
    // Get all choice buttons
    const choices = await page.$$('button.text-left');
    
    // Click each choice until we find the correct one (marked by green)
    for (const choice of choices) {
      await choice.click();
      const classNames = await choice.getAttribute('class');
      if (classNames?.includes('bg-green-100')) {
        // Found correct answer with green background
        expect(classNames).toContain('border-green-500');
        break;
      }
      // If not correct, reload for next attempt
      await page.reload();
      await page.waitForSelector('text=Practice Question');
    }
  });

  test('shows red feedback for incorrect answer', async ({ page }) => {
    // Get all choice buttons
    const choices = await page.$$('button.text-left');
    
    // Click each choice until we find an incorrect one (marked by red)
    for (const choice of choices) {
      await choice.click();
      const classNames = await choice.getAttribute('class');
      if (classNames?.includes('bg-red-100')) {
        // Found incorrect answer with red background
        expect(classNames).toContain('border-red-500');
        break;
      }
      // If not incorrect, reload for next attempt
      await page.reload();
      await page.waitForSelector('text=Practice Question');
    }
  });

  test('updates score after answering question', async ({ page }) => {
    // Go to progress view first to get initial numbers
    await page.click('button:has-text("Switch to Progress View")');
    
    // Get initial correct count text
    const initialCorrectElement = await page.locator('div:has-text("Correct:")').first();
    const initialCorrectText = await initialCorrectElement.innerText();
    const initialCorrect = Number(initialCorrectText.replace(/\D/g, ''));

    // Get initial total count text
    const initialTotalElement = await page.locator('div:has-text("Total Questions:")').first();
    const initialTotalText = await initialTotalElement.innerText();
    const initialTotal = Number(initialTotalText.replace(/\D/g, ''));

    // Go back to question view
    await page.click('button:has-text("Switch to Question View")');
    await page.waitForSelector('text=Practice Question');

    // Answer a question (try to get it correct)
    const choices = await page.$$('button.text-left');
    for (const choice of choices) {
      await choice.click();
      const classNames = await choice.getAttribute('class');
      if (classNames?.includes('bg-green-100')) {
        // Got correct answer, can move on
        break;
      }
      // If not correct, reload and try again
      await page.reload();
      await page.waitForSelector('text=Practice Question');
    }

    // Click next question
    await page.click('button:has-text("Next Question")');

    // Go back to progress view
    await page.click('button:has-text("Switch to Progress View")');

    // Get updated numbers
    const updatedCorrectElement = await page.locator('div:has-text("Correct:")').first();
    const updatedCorrectText = await updatedCorrectElement.innerText();
    const updatedCorrect = Number(updatedCorrectText.replace(/\D/g, ''));

    const updatedTotalElement = await page.locator('div:has-text("Total Questions:")').first();
    const updatedTotalText = await updatedTotalElement.innerText();
    const updatedTotal = Number(updatedTotalText.replace(/\D/g, ''));

    // Verify numbers increased appropriately
    expect(updatedTotal).toBe(initialTotal + 1);
    // If we got a correct answer, correct count should increase
    if (updatedCorrect > initialCorrect) {
      expect(updatedCorrect).toBe(initialCorrect + 1);
    }
  });
});