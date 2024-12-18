// import { test, expect } from '@playwright/test';

// test.describe('Question View Tests', () => {
//   test.beforeEach(async ({ page }) => {

//     await page.goto('http://localhost:3000/question');
//     await expect(page).toHaveURL('/question');
//   });

//   test('shows green feedback for correct answer', async ({ page }) => {

//     const choices = await page.$$('button.text-left');
    
//     // Click each choice until we find the correct one 
//     for (const choice of choices) {
//       await choice.click();
//       const classNames = await choice.getAttribute('class');
//       if (classNames?.includes('bg-green-100')) {
//         // Found correct answer with green background
//         expect(classNames).toContain('border-green-500');
//         break;
//       }
//       // If not correct, reload for next attempt
//       await page.reload();
//       await page.waitForSelector('text=Practice Question');
//     }
//   });

//   test('shows red feedback for incorrect answer', async ({ page }) => {
//     // Get all choice buttons
//     const choices = await page.$$('button.text-left');
    
//     // Click each choice until we find an incorrect one
//     for (const choice of choices) {
//       await choice.click();
//       const classNames = await choice.getAttribute('class');
//       if (classNames?.includes('bg-red-100')) {

//         // Found incorrect answer with red background
//         expect(classNames).toContain('border-red-500');
//         break;
//       }

//       // If not incorrect, reload for next attempt
//       await page.reload();
//       await page.waitForSelector('text=Practice Question');
//     }
//   });


// });