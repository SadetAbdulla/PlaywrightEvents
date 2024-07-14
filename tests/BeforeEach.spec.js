import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120000);

let browser;
let context;
let page;

test.beforeEach(async () => {
    // Launch the browser
    browser = await chromium.launch({
        headless: false, // Set to true if you want to run tests in headless mode
    });

    // Create a new browser context with microphone and camera permissions
    context = await browser.newContext({
        permissions: ['microphone', 'camera'],
    });

    // Create a new page
    page = await context.newPage();

    // Perform common setup steps before each test
    await page.goto('https://access.staging.events.boostlingo.com/');
    await page.getByPlaceholder('E-mail').click();
    await page.getByPlaceholder('E-mail').fill('sadet.abdulla@boostlingo.com');
    await page.getByPlaceholder('E-mail').press('Enter');
    await page.getByPlaceholder('Password').fill('test');
    await page.getByPlaceholder('Password').press('Enter');
    await page.getByRole('button', { name: 'Plan Event' }).click();
});

// test.afterEach(async () => {
//     // Close the page and context after each test
//     await page.close();
//     await context.close();
//     await browser.close();
//   });


test('UploadImgNotNeededEvent', async () => {
    // Continue with the test-specific steps

    await page.getByPlaceholder('Please enter the name of this').click();
    await page.getByPlaceholder('Please enter the name of this').fill('Not Needed Event');
    await page.getByRole('button', { name: 'Create event' }).click();
    await page.getByRole('tab', { name: 'Presentation' }).click();

    console.log('Waiting for the file input element...');

    //Ensure the input file element is in the DOM without checking for visibility
    await page.waitForSelector("div.css-1q7njkh:nth-child(6) input[type='file']", { state: 'attached' });
    // Set input files for the input file element
    await page.setInputFiles("div.css-1q7njkh:nth-child(6) input[type='file']", "tests/uploadFolder/picture.jpg");

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForTimeout(5000);
});

test('testVideoAudioNotEndedEvent', async () => {

    await page.getByPlaceholder('Please enter the name of this').click();
    await page.getByPlaceholder('Please enter the name of this').fill('automation');
    await page.getByRole('button', { name: 'Create event' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Join', exact: true }).first().click();
    const page1 = await page1Promise;
    await page.waitForTimeout(5000);
    await page1.getByRole('button', { name: 'Join event' }).click();

    await page1.getByLabel('Click to start the event.').click();
    await page.waitForTimeout(5000);

    // Unmute mic and turn on camera
    await page1.getByLabel('Unmute mic').click();
    await page1.waitForTimeout(5000); // Wait for 5 seconds to validate mic

    await page1.getByLabel('Turn on camera').click();
    await page1.waitForTimeout(5000); // Wait for 5 seconds to validate camera

    // Validate if the video is showing on the grid
    const videoGrid = await page1.waitForSelector('#mainPlayer', { state: 'visible', timeout: 5000 });
    expect(videoGrid).toBeTruthy();

    // Validate if the audio is coming through when mic is on
    const audioIndicator = await page1.waitForSelector("//div[normalize-space()='1']", { state: 'visible', timeout: 5000 });
    expect(audioIndicator).toBeTruthy();

    // Stop the event
    await page1.getByLabel('stop event').click();
    await page1.getByRole('button', { name: 'Yes' }).click();

    // Close the event
    await page1.getByText('Close').click();
    await page1.waitForTimeout(6000);
});

test('MixedEvent', async () => {
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

