class EventPage {
  constructor(page) {
    this.page = page;
  }

  async planEvent(eventName) {
    await this.page.getByRole('button', { name: 'Plan Event' }).click();
    await this.page.getByPlaceholder('Please enter the name of this').click();
    await this.page.getByPlaceholder('Please enter the name of this').fill('HumanInter&booth');
    await this.page.getByRole('button', { name: 'Human Interpretation' }).click(eventName);
    await this.page.getByRole('button', { name: 'Create event' }).click();
    await this.page.getByRole('tab', { name: 'Languages & Booths' }).click();
    await this.page.getByRole('button', { name: 'Add language' }).click();
    await this.page.locator('.css-18euh9p').click();
    await this.page.getByRole('option', { name: 'Danish' }).click();
    await this.page.getByRole('button', { name: 'Add languages' }).click();
    await this.page.getByPlaceholder('Interpreter email').first().click();
    await this.page.getByPlaceholder('Interpreter email').first().fill('testsix.testsix@boostlingo.com');
    await this.page.getByRole('tab', { name: 'Participants' }).click();
    await this.page.getByRole('button', { name: 'Add operator' }).click();
    await this.page.getByPlaceholder('Add operators here').click();
    await this.page.getByPlaceholder('Add operators here').fill('testthree.testthree@boostlingo.com');
    await this.page.getByRole('button', { name: 'Add operators' }).click();
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
    await this.page.getByRole('tab', { name: 'General' }).click();
    
    // Wait for the dialog and handle it
    this.page.once('dialog', async dialog => {
      console.log('Dialog message:', dialog.message());
      await dialog.accept();
    });
    
    await this.page.waitForTimeout(5000);
  }

  async copyLink() {
    await this.page.getByRole('button', { name: 'Copy link' }).first().click();
    return this.page.evaluate(() => navigator.clipboard.readText());
  }
}

module.exports = EventPage;
