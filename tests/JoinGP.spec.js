const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const LoginPage = require('../pages/LoginPage');

test.setTimeout(150000);

test('Join Meeting Test', async ({ page, browser }) => {
  // Custom function to handle dialogs
  const handleDialog = async (dialog) => {
    if (dialog.message().includes('Use your cameras') || dialog.message().includes('Use your microphones')) {
      await dialog.accept();
    }
  };

  // Part 1: Copy the Meeting Link
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.login('sadet.abdulla@boostlingo.com', 'test');
  await loginPage.waitForLoginSuccess();

  await page.getByRole('button', { name: 'Plan Event' }).click();
  await page.getByPlaceholder('Please enter the name of this').click();
  await page.getByPlaceholder('Please enter the name of this').fill('test');
  await page.getByRole('button', { name: 'Create event' }).click();

  await page.getByRole('button', { name: 'Copy link' }).first().click();
  
  // Explicit wait to ensure the link is copied
  await page.waitForTimeout(3000);

  // Retrieve the copied link from the clipboard
  const generatedLink = await page.evaluate(() => navigator.clipboard.readText());
  console.log(`Generated and copied link: ${generatedLink}`);

  // Save the generated link to a file
  fs.writeFileSync('generatedLink.txt', generatedLink);

  // Close the first page (but keep the browser open for the next part)
  await page.close();

  // Launch a new browser and navigate to the generated link
  const browser2 = await chromium.launch();
  const context2 = await browser2.newContext();
  const page2 = await context2.newPage();

  // Set up dialog handler for the new page
  page2.on('dialog', handleDialog);

  // Retrieve the generated link from the file
  const generatedLinkFromFile = fs.readFileSync('generatedLink.txt', 'utf-8').trim();

  if (!generatedLinkFromFile) {
    console.error('No link found. Ensure the link was generated successfully.');
    await browser2.close();
    return;
  }

  console.log(`Using generated link: ${generatedLinkFromFile}`);

  // Navigate to the generated link
  await page2.goto(generatedLinkFromFile);
  await page2.getByPlaceholder('Your name').click();
  await page2.getByPlaceholder('Your name').fill('Speaker');
  await page2.getByRole('button', { name: 'Join event' }).click();
  await page2.getByLabel('Turn on camera').click();
  await page2.getByLabel('Unmute mic').click();

  // Close the browser after joining the event
  await browser2.close();
});
