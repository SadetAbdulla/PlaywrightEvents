import { test, expect, chromium } from '@playwright/test';

// test('test', async ({ page }) => {
//     test.setTimeout(120000);
    

test.skip('MixedEvent', async () => {
    const browser = await chromium.launch({
      headless: false,
    });
      const context = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    test.setTimeout(120000);
    const page = await context.newPage();

  await page.goto('https://access.staging.events.boostlingo.com/');
  await page.getByPlaceholder('E-mail').click();
  await page.getByPlaceholder('E-mail').fill('sadet.abdulla@boostlingo.com');
  await page.getByPlaceholder('E-mail').press('Enter');
  await page.getByPlaceholder('Password').fill('test');
  await page.getByPlaceholder('Password').press('Enter');
  await page.getByRole('button', { name: 'Plan Event' }).click();
  await page.getByPlaceholder('Please enter the name of this').click();
  await page.getByPlaceholder('Please enter the name of this').fill('test');
  await page.getByRole('button', { name: 'Mixed Interpretation' }).click();
  await page.getByRole('button', { name: 'Create event' }).click();
  await page.getByRole('tab', { name: 'AI Languages' }).click();
  await page.locator('div').filter({ hasText: /^Enable event captions$/ }).locator('span').first().click();
  await page.getByRole('button', { name: 'Add language' }).click();
  await page.locator('.css-18euh9p').click();
  await page.getByRole('option', { name: 'Danish' }).click();
  await page.getByRole('button', { name: 'Add languages' }).click();
  await page.locator('.css-ltqa49 > .css-15vqpxh > label:nth-child(4) > .chakra-checkbox__control').click();
  await page.locator('.css-ltqa49 > .css-15vqpxh > label > .chakra-checkbox__control').first().click();
  await page.getByRole('tab', { name: 'Languages & Booths' }).click();
  await page.getByRole('button', { name: 'Add language' }).click();
  await page.locator('.css-18euh9p').click();
  await page.getByRole('option', { name: 'Español' }).click();
  await page.getByRole('button', { name: 'Add languages' }).click();
  await page.locator('div:nth-child(4) > .css-k008qs > input').first().click();
  await page.locator('div:nth-child(4) > .css-k008qs > input').first().fill('testsix.testsix@boostlingo.com');
//   await page.getByRole('tab', { name: 'Participants' }).click();

  await page.getByRole('tab', { name: 'Presentation' }).click();

  await page.waitForSelector("div.css-0:nth-child(1) > .css-1q7njkh:nth-child(6) input[type='file']", { state: 'attached' });
  await page.setInputFiles("div.css-0:nth-child(1) > .css-1q7njkh:nth-child(6) input[type='file']", "tests/uploadFolder/picture.jpg");

  await page.waitForSelector("div.css-0:nth-child(2) input[type='file']", { state: 'attached' });
  await page.setInputFiles("div.css-0:nth-child(2) input[type='file']", "tests/uploadFolder/picture.jpg");


  await page.waitForSelector("div.css-0:nth-child(3) input[type='file']", { state: 'attached' });
  await page.setInputFiles("div.css-0:nth-child(3) input[type='file']", "tests/uploadFolder/picture.jpg");

  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('tab', { name: 'General' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Join', exact: true }).first().click();
  const page1 = await page1Promise;
  await page.waitForTimeout(5000);
  await page1.getByRole('button', { name: 'Join event' }).click();

  await page1.getByLabel('Click to start the event.').click();
  await page1.getByLabel('Unmute mic').click();
  await page1.getByLabel('Turn on camera').click();
  await page1.getByLabel('stop event').click();
  await page1.getByRole('button', { name: 'Yes' }).click();
  await page1.getByText('Close').click();

  await page.waitForTimeout(5000);


});

test('UploadImgNotNeededEvent', async () => {
    const browser = await chromium.launch({
      headless: true,
    });
      const context = await browser.newContext({
      permissions: ['microphone', 'camera'],
    });
    

    test.setTimeout(120000);

    const page = await context.newPage();
 
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
    await page.getByRole('tab', { name: 'Presentation' }).click();

    console.log('Waiting for the file input element...');

    // Ensure the input file element is in the DOM without checking for visibility
    await page.waitForSelector("div.css-1q7njkh:nth-child(6) input[type='file']", { state: 'attached' });
  // Set input files for the input file element
    await page.setInputFiles("div.css-1q7njkh:nth-child(6) input[type='file']", "tests/uploadFolder/picture.jpg");

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForTimeout(5000);

});