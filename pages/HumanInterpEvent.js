class HumanInterpEvent {
    constructor(page) {
        this.page = page;
    }

    async planHumanEvent(eventName) {
        await this.page.getByRole('button', { name: 'Plan Event' }).click();
        await this.page.getByPlaceholder('Please enter the name of this').fill('Human Interpretation');
        await this.page.getByRole('button', { name: 'Human Interpretation' }).click(eventName);
        //        await this.page.getByRole('button', { name: eventType }).click();

        await this.page.getByRole('button', { name: 'Create event' }).click();
        await this.page.getByRole('tab', { name: 'Languages & Booths' }).click();
        await this.page.getByRole('button', { name: 'Add language' }).click();
        await this.page.locator('.css-18euh9p').click();
        await this.page.getByRole('combobox', { name: 'Add languages' }).fill('Spanish');
        await this.page.getByRole('option', { name: 'Spanish', exact: true }).click();
        await this.page.getByRole('button', { name: 'Add languages' }).click();
        await this.page.locator('div').filter({ hasText: /^Enable event captions$/ }).locator('span').nth(1).click();
        await this.page.getByRole('button', { name: 'Save Changes' }).click();
        await this.page.getByRole('tab', { name: 'General' }).click();
        await this.page.waitForTimeout(5000);
    }

    async handleDialog() {
        this.page.on('dialog', async (dialog) => {
            if (dialog.message().includes('Allow')) {
                await dialog.accept();
            }
        });
    }

    async copyLink() {
        await this.page.getByRole('button', { name: 'Copy link' }).first().click();
        return this.page.evaluate(() => navigator.clipboard.readText());
    }
}

module.exports = HumanInterpEvent;
