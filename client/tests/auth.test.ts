import { test, expect } from '@playwright/test';
import { setupClerkTestingToken, clerk } from "@clerk/testing/playwright";
import { clerkSetup } from "@clerk/testing/playwright";

test("login/logout", async ({ page }) => {
    await clerkSetup({
      CLERK_SECRET_KEY: "sk_test_dLSNQePmD9QR7YrivnLbeECwxivReKdBY0acQVowaa"
    });
    setupClerkTestingToken({ page });
    await page.goto('http://localhost:3000');
    await clerk.loaded({ page });
    const loginButton = page.getByRole("button", { name: "Sign in" })
    await expect(loginButton).toBeVisible();
 
    await clerk.signIn({
        page,
        signInParams: {
          strategy: "password",
          identifier: 'test42@brown.edu',  // Email
          password: 'Wxy20020624!',        // Password
        },
      });
  

;


    await clerk.signOut({ page });
    });