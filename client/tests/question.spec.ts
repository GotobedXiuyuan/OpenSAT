import { test, expect } from '@playwright/test';

test.describe('Question View Tests', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:3000/question');
    await expect(page).toHaveURL('/question');
  });

  test('shows green feedback for correct answer', async ({ page }) => {

    const choices = await page.$$('button.text-left');
    
    // Click each choice until we find the correct one 
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
    
    // Click each choice until we find an incorrect one
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

    // Answer a question
    const choices = await page.$$('button.text-left');
    for (const choice of choices) {
      await choice.click();
      const classNames = await choice.getAttribute('class');
      if (classNames?.includes('bg-green-100')) {

        break;
      }
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
    if (updatedCorrect > initialCorrect) {
      expect(updatedCorrect).toBe(initialCorrect + 1);
    }
  });
});