import { test, expect, type Page, type Route } from '@playwright/test';

const json = (body: unknown, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body),
});

const continueDocument = async (route: Route) => {
  if (route.request().resourceType() === 'document') {
    await route.continue();
    return true;
  }
  return false;
};

const mockUsers = (page: Page, users: Array<unknown>) =>
  page.route('**/users**', async (route) => {
    if (await continueDocument(route)) return;
    await route.fulfill(json(users));
  });

const setCurrentUser = (page: Page, user: object) =>
  page.addInitScript(() => {
    localStorage.setItem('vacation-app-current-user', JSON.stringify(user));
  });

const requestCard = (page: Page, title: string) =>
  page.locator('.request-card').filter({ hasText: title });

const dateInputs = (page: Page) => page.locator('input[type="date"]');

const requestRoute = async (
  page: Page,
  handler: (request: ReturnType<Route['request']>, route: Route) => Promise<void>
) =>
  page.route('**/requests**', async (route) => {
    if (await continueDocument(route)) return;
    await handler(route.request(), route);
  });

const validatorUser = { id: 2, name: 'Validator User', role: 'validator' };
const requesterUser = { id: 2, name: 'Requester User', role: 'requester' };

test('submits a time off request as a requester', async ({ page }) => {
  await mockUsers(page, [requesterUser]);

  await requestRoute(page, async (request, route) => {
    if (request.method() === 'GET') {
      await route.fulfill(json([]));
      return;
    }

    const payload = JSON.parse(await request.postData() ?? '{}');
    await route.fulfill(
      json({
        id: 1,
        ...payload,
        status: 'pending',
        user: requesterUser,
      }, 201)
    );
  });

  await setCurrentUser(page, requesterUser);
  await page.goto('/requests');

  await expect(page.getByRole('heading', { name: 'Request Time Off' })).toBeVisible();
  await dateInputs(page).nth(0).fill('2025-12-01');
  await dateInputs(page).nth(1).fill('2025-12-05');
  await page.fill('textarea', 'Family vacation');
  await page.click('button:has-text("Submit request")');

  await expect(page.getByText('Family vacation')).toBeVisible();
  await expect(page.getByText('pending', { exact: true })).toBeVisible();
});

test('approves and rejects pending requests as a validator', async ({ page }) => {
  const requests = [
    {
      id: 1,
      startDate: '2025-02-01',
      endDate: '2025-02-02',
      reason: 'Approve me',
      status: 'pending',
      user: { id: 3, name: 'Requester A', role: 'requester' },
    },
    {
      id: 2,
      startDate: '2025-03-01',
      endDate: '2025-03-02',
      reason: 'Reject me',
      status: 'pending',
      user: { id: 4, name: 'Requester B', role: 'requester' },
    },
  ];

  await mockUsers(page, [validatorUser]);

  await requestRoute(page, async (request, route) => {
    const pathname = new URL(request.url()).pathname;

    if (request.method() === 'GET') {
      await route.fulfill(json(requests));
      return;
    }

    if (pathname.endsWith('/requests/1')) {
      requests[0].status = 'approved';
      await route.fulfill(json(requests[0]));
      return;
    }

    if (pathname.endsWith('/requests/2')) {
      requests[1].status = 'rejected';
      await route.fulfill(json(requests[1]));
      return;
    }

    await route.continue();
  });

  await setCurrentUser(page, validatorUser);
  await page.goto('/requests');

  const userSelect = page.locator('.user-select');
  await expect(userSelect.locator('option:checked')).toHaveText('Validator User — validator');
  await expect(userSelect).toHaveValue('2');

  const approveCard = requestCard(page, 'Approve me');
  const rejectCard = requestCard(page, 'Reject me');

  await expect(approveCard.getByText('pending', { exact: true })).toBeVisible();
  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/requests/1') && res.request().method() === 'PATCH'),
    approveCard.getByRole('button', { name: 'Approve' }).click(),
  ]);
  await expect(approveCard.getByText('approved', { exact: true })).toBeVisible();

  await Promise.all([
    page.waitForResponse((res) => res.url().includes('/requests/2') && res.request().method() === 'PATCH'),
    rejectCard.getByRole('button', { name: 'Reject' }).click(),
  ]);
  await expect(rejectCard.getByText('rejected', { exact: true })).toBeVisible();
});
