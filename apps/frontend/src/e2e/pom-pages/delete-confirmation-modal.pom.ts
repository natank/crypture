import { Page, Locator } from '@playwright/test';

export class DeleteConfirmationModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole('dialog');

    this.confirmButton = this.modal.getByRole('button', { name: /confirm/i });
    this.cancelButton = this.modal.getByRole('button', { name: /cancel/i });
    this.message = this.modal.getByText(/are you sure/i);
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.modal.isVisible();
  }

  async getMessageText(): Promise<string> {
    return (await this.message.textContent()) ?? '';
  }
}
