const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const LoginPage = require('../pages/LoginPage');
const EventPage = require('../pages/EventPage');
const JoinEventPage = require('../pages/JoinEventPage');

test.setTimeout(150000);

const handleDialog = async (page) => {
  page.on('dialog', async dialog => {
    const message = dialog.message();
    console.log(`Dialog message: ${message}`);
    if (message.includes('See text and images copied to the clipboard') || 
        message.includes('Use your cameras') ||
        message.includes('Use your microphones')) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
};

test('Join Meeting Test with Multiple Roles', async () => {
  // Role 1: Create Event and Copy Link
  const browser1 = await chromium.launch();
  const context1 = await browser1.newContext();
  const page1 = await context1.newPage();
  const loginPage1 = new LoginPage(page1);
  await page1.waitForTimeout(2000);

  handleDialog(page1);
  await page1.waitForTimeout(2000);


  await loginPage1.navigateToLoginPage();
  await loginPage1.login('sadet.abdulla@boostlingo.com', 'test');

  const eventPage1 = new EventPage(page1);
  await eventPage1.planEvent('test');

  // Wait for dialog and copy link
  const generatedLink = await eventPage1.copyLink();
  console.log(`Generated and copied link: ${generatedLink}`);
  fs.writeFileSync('generatedLink.txt', generatedLink);

  // Role 2: Join Event with Link
  const browser2 = await chromium.launch();
  const context2 = await browser2.newContext();
  const page2 = await context2.newPage();
  const joinEventPage2 = new JoinEventPage(page2);
  handleDialog(page2);
  await page2.waitForTimeout(2000);

  await joinEventPage2.joinEvent(generatedLink, 'Role 2');

  // Role 3: Login and Join Event with Link
  const browser3 = await chromium.launch();
  const context3 = await browser3.newContext();
  const page3 = await context3.newPage();
  const loginPage3 = new LoginPage(page3);
  handleDialog(page3);
  await page3.waitForTimeout(2000);


  await loginPage3.navigateToLoginPage();
  await loginPage3.login('testsix.testsix@boostlingo.com', 'test');
  const page3NewTab = await context3.newPage();
  const joinEventPage3 = new JoinEventPage(page3NewTab);
  handleDialog(page3NewTab);

  await joinEventPage3.joinEvent(generatedLink, 'Role 3');

  // Role 4: Login and Join Event with Link
  const browser4 = await chromium.launch();
  const context4 = await browser4.newContext();
  const page4 = await context4.newPage();
  const loginPage4 = new LoginPage(page4);
  handleDialog(page4);
  await page4.waitForTimeout(2000);


  await loginPage4.navigateToLoginPage();
  await loginPage4.login('testthree.testthree@boostlingo.com', 'test');
  const page4NewTab = await context4.newPage();
  const joinEventPage4 = new JoinEventPage(page4NewTab);
  handleDialog(page4NewTab);
  await page4NewTab.waitForTimeout(2000);

  await joinEventPage4.joinEvent(generatedLink, 'Role 4');

  // Do not close the browsers at the end
});
