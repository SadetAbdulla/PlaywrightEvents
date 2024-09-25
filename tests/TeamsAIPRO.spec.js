require('dotenv').config(); // Load environment variables from .env file

const { test, expect } = require('@playwright/test');

// Retrieve the password from the environment variable
const password = process.env.PASSWORD;

test.setTimeout(150000);

test('login and perform actions', async ({ page }) => {
  if (!password) {
    throw new Error('PASSWORD environment variable is not set');
  }

  // Navigate to the login page
  await page.goto('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=openId%20profile%20openid%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fv2&client-request-id=5e056a53-1944-4e32-b1ec-d78d16188a67&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.7.1&client_info=1&code_challenge=sz19BOqs0_1I2TA2pkXnJT3t9EQrQR2z3wPJt54Zto4&code_challenge_method=S256&nonce=4ae3c288-2b72-467e-8f36-68a489285872&state=eyJpZCI6Ijg5YjhiNzBiLWQzMzktNGMxOC05NTBhLWUzYzZkMzJkZTkxZCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D');

  // Interact with login form
  await page.fill('input[name="loginfmt"]', 'sadet.abdulla@boostlingo.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.fill('input[name="passwd"]', password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Don\'t show this again').click();
  await page.getByRole('button', { name: 'No' }).click();
  // Navigate to Teams page and perform actions
  await page.goto('https://teams.microsoft.com/v2/');

  // Handle Teams page actions
  await page.getByRole('treeitem', { name: 'Meeting Chat. test5 Last' }).locator('svg').first().click();
  await page.getByRole('button', { name: 'Join' }).click();  await page.click('role=button[name="Join"]');
  await page.click('label=Mic on');
  await page.click('label=Boostlingo AI Pro');

  // Handling iframes
  const frame = page.frameLocator('iframe[name="embedded-page-container"]').frameLocator('#iframe');
  await frame.click('role=button[name="Start personal session »"]');
  await frame.click('role=button[name="Translate"]');
  await frame.click('role=button[name="Speech"]');
  await frame.fill('placeholder=Please enter session Name', 'test AI');
  await frame.click('.css-18euh9p');
  await frame.fill('#react-select-2-input', 'fr');
  await frame.click('role=option[name="French"]');
  await frame.click('.css-j93siq > .css-18euh9p');
  await frame.fill('#react-select-5-input', 'sp');
  await frame.press('#react-select-5-input', 'Enter');
  await frame.click('role=button[name="Create"]');
  await frame.click('label=Pause');
  await page.click('div:nth-child(8) > div > div > div:nth-child(2) > div');
  await frame.click('role=alert');
});
