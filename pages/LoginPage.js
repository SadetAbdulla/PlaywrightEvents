const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async navigateToLoginPage() {
        await this.page.goto('https://access.staging.events.boostlingo.com/');
    }

    async enterEmail(email) {
        await this.page.getByPlaceholder('E-mail').click();
        await this.page.getByPlaceholder('E-mail').fill(email);
        await this.page.getByPlaceholder('E-mail').press('Enter');
    }

    async enterPassword(password) {
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByPlaceholder('Password').press('Enter');
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
    }

    async waitForLoginSuccess(timeout = 5000) {
        await this.page.waitForTimeout(timeout);
    }
    // async waitForLoginSuccess() {
    //     await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    // }

    async handleDialog() {
        this.page.on('dialog', async (dialog) => {
            if (dialog.message().includes('Allow')) {
                await dialog.accept();
            }
        });
    }
}

module.exports = LoginPage;