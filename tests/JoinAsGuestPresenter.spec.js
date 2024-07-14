const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');

test('Join Meeting Test', async ({ page }) => {
  // Part 1: Copy the Meeting Link
  await page.goto('https://access.staging.events.boostlingo.com/');
  await page.getByPlaceholder('E-mail').click();
  await page.getByPlaceholder('E-mail').fill('sadet.abdulla@boostlingo.com');
  await page.getByPlaceholder('E-mail').press('Enter');
  await page.getByPlaceholder('Password').fill('test');
  await page.getByPlaceholder('Password').press('Enter');
  await page.getByRole('button', { name: 'Plan Event' }).click();
  await page.getByPlaceholder('Please enter the name of this').click();
  await page.getByPlaceholder('Please enter the name of this').fill('test');
  await page.getByRole('button', { name: 'Create event' }).click();
  await page.waitForTimeout(5000);
  await page.handleDialog();

  await page.getByRole('button', { name: 'Copy link' }).first().click();

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
  await page2.getByPlaceholder('Your name').fill('test');
  await page2.getByRole('button', { name: 'Join event' }).click();
  await page2.getByLabel('Turn on camera').click();
  await page2.getByLabel('Unmute mic').click();

  // Add any additional steps to join the event if necessary
  // For example, clicking a join button
  // await page2.click('#joinEventButton');  // replace with the actual join button selector if needed

  // You can add more assertions or interactions here as needed

  // Close the browser after joining the event
  await browser2.close();
});
