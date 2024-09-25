const { test, expect, chromium } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');


test('test2', async ({ page }) => {
    const browser = await chromium.launch({
        headless: true,
    });
    const context = await browser.newContext({
        permissions: ['microphone', 'camera'],
    });

    test.setTimeout(120000);

    const newPage  = await context.newPage();
    const loginPage = new LoginPage(newPage);

    await loginPage.navigateToLoginPage();
    await loginPage.login('sadet.abdulla@boostlingo.com', 'test');
    await loginPage.waitForLoginSuccess();

    await newPage.getByRole('button', { name: 'Plan Event' }).click();
    await newPage.getByPlaceholder('Please enter the name of this').click();
    await newPage.getByPlaceholder('Please enter the name of this').fill('test');
    await newPage.getByRole('button', { name: 'Create event' }).click();
    await newPage.getByRole('tab', { name: 'Presentation' }).click();

    console.log('Waiting for the file input element...');

    // Ensure the input file element is in the DOM without checking for visibility
    await newPage.waitForSelector("div.css-1q7njkh:nth-child(6) input[type='file']", { state: 'attached' });
  // Set input files for the input file element
  const fileInput = await newPage.locator("div.css-1q7njkh:nth-child(6) input[type='file']");

    // Set input files for the input file element using setInputFiles on the locator
    await fileInput.setInputFiles("tests/uploadFolder/picture.jpg");
    await newPage.getByRole('button', { name: 'Save Changes' }).click();
    await newPage.waitForTimeout(5000);
});