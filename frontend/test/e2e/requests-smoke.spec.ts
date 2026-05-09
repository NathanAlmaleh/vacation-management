import { test, expect } from '@playwright/test';

test('smoke: loads /requests and shows dashboard heading', async ({ page }) => {
  // Mock API calls so the e2e test is stable.
  await page.route('**/requests', async (route) => {
    const request = route.request();

    if (request.resourceType() === 'document') {
      await route.continue();
      return;
    }

    const url = request.url();
    const method = request.method();

    if (method === 'GET' && url.includes('/requests')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            startDate: '2025-01-01',
            endDate: '2025-01-02',
            reason: 'Vacation',
            status: 'pending',
            user: { id: 2, name: 'Req', role: 'requester' },
          },
        ]),
      });
      return;
    }

    await route.fulfill({ status: 200, body: '[]' });
  });

  await page.route('**/users', async (route) => {
    const request = route.request();

    if (request.resourceType() === 'document') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 2, name: 'Validator User', role: 'validator' },
      ]),
    });
  });

  // Seed localStorage so sidebar selects a validator immediately.
  await page.addInitScript(() => {
    localStorage.setItem(
      'vacation-app-current-user',
      JSON.stringify({ id: 2, name: 'Validator User', role: 'validator' })
    );
  });

  await page.goto('/requests');

  await expect(
    page.getByRole('heading', { name: 'Requests dashboard' })
  ).toBeVisible();
  await expect(page.getByText('New vacation request')).toBeVisible();
});
