import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import LoginPage from '../pages/LoginPage'; 
import HumanInterpEvent from '../pages/HumanInterpEvent';

test.setTimeout(150000);

test('Event Caption Automation', async ({ browser }) => {
  // Define the download path
  const downloadPath = path.resolve('C:/Users/Lenovo/Downloads');

  // Ensure the download path exists
  try {
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true }); // Create the directory if it doesn't exist
    }
  } catch (error) {
    console.error('Error creating directory:', error);
  }

  // Create a new browser context with the download path
  const context = await browser.newContext({
    acceptDownloads: true,
  });

  // Set permissions for the context
  await context.grantPermissions(['microphone', 'camera']);

  // Create a new page in the context
  const page = await context.newPage();
  page.setDefaultTimeout(350000);

  const loginPage = new LoginPage(page);
  const humanInterpEvent = new HumanInterpEvent(page);

  // Login into the app
  await loginPage.navigateToLoginPage();
  await loginPage.login('sadet.abdulla@boostlingo.com', 'test');
  await loginPage.waitForLoginSuccess();

  // Create the event
  await humanInterpEvent.planHumanEvent('Human Interpretation');
  
  // Join event and start captions
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Join', exact: true }).first().click();
  const page2 = await page2Promise;
  await page2.getByRole('button', { name: 'mic-icon Unmute' }).click();
  await page2.getByRole('button', { name: 'Join event' }).click();
  await page2.waitForTimeout(5000);

  await page2.getByLabel('Start event.').click();
  await page2.waitForTimeout(9000);
  // Enable the caption
  await page2.getByLabel('right panel toggle on').click();
  await page2.getByLabel('Transcription').click();
  await page2.getByRole('button', { name: 'Start captions' }).click();
  await page2.waitForTimeout(8000);

  await page2.getByRole('button', { name: 'Captions hidden ' }).click();
  await page2.getByText('Show').click();
  await page2.waitForTimeout(20000);

  // Save captions to a file
  await page2.waitForSelector('#caption-text', { state: 'visible' });
  let captions = await page2.$eval('#caption-text', el => el.textContent);

  // Clean the captions
  const cleanedCaptions = cleanText(captions);
  const captionsFilePath = path.join(downloadPath, 'captions.txt');
  fs.writeFileSync(captionsFilePath, cleanedCaptions);

  // Stop the event
  await page2.getByLabel('stop event').click();
  await page2.getByRole('button', { name: 'Yes' }).click();
  await page2.close();

  // Go to the previous page and download the captions
  await page.reload(); // Ensure the page is refreshed

  // Extract the event key from the URL
  const eventUrl = page.url();
  const eventKey = eventUrl.split('/').pop();
  console.log('Extracted Event Key:', eventKey);

  if (!eventKey) {
    throw new Error('Event key could not be extracted from the URL');
  }

  await page.getByRole('tab', { name: 'Captions' }).click();
  await page.getByRole('button', { name: 'Generate transcription summary' }).click();
  await page.getByRole('combobox').first().selectOption('raw-lines');
  await page.getByRole('combobox').nth(1).selectOption('en');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Transcript' }).click();
  const download = await downloadPromise;

  const downloadedFilePath = path.join(downloadPath, `event-${eventKey}-caption.txt`);
  await download.saveAs(downloadedFilePath);

  // Compare captions
  compareCaptions(captionsFilePath, downloadedFilePath);
});

// Function to normalize and remove the "Sadet Abdulla: " prefix
function cleanText(text) {
  return text
    .replace(/Sadet Abdulla\s*:\s*/g, '') // Remove all instances of "Sadet Abdulla: " with optional spaces
    .replace(/([.?!])\s*(?=[A-Za-z])/g, '$1 ') // Ensure space after punctuation if followed by a letter
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
}

// Function to compare captions
function compareCaptions(captionsFile, expectedTextFile) {
  // Handling newline characters in captions and expected text files
  const captions = fs.readFileSync(captionsFile, 'utf-8').split('\n').map(cleanText).join(' ');
  const expectedText = fs.readFileSync(expectedTextFile, 'utf-8').split('\n').map(cleanText).join(' ');

  const captionsWords = captions.split(' ');
  const expectedWords = expectedText.split(' ');

  let match = true;
  const maxLength = Math.max(captionsWords.length, expectedWords.length);

  for (let i = 0; i < maxLength; i++) {
    const captionWord = captionsWords[i] || '';
    const expectedWord = expectedWords[i] || '';
    if (captionWord !== expectedWord) {
      console.error(`Mismatch at word ${i + 1}:`);
      console.error(`Caption: ${captionWord}`);
      console.error(`Expected: ${expectedWord}`);
      match = false;
    }
  }

  if (match) {
    console.log('Captions match the expected text.');
  } else {
    console.error('Captions do not match the expected text.');
  }
}
