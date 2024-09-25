class JoinEventPage {
  constructor(page) {
    this.page = page;
  }

  async joinEvent(link, roleName) {
    await this.page.goto(link);
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.getByPlaceholder('Your name').click();
    await this.page.getByPlaceholder('Your name').fill(roleName);
    await this.page.getByRole('button', { name: 'Join event' }).click();
    await this.page.getByLabel('Turn on camera').click();
    await this.page.getByLabel('Unmute mic').click();
  }
}

module.exports = JoinEventPage;
