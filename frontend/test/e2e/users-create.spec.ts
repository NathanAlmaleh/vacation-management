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

const mockUsers = (page: Page, users: Array<object>) =>
  page.route('**/users**', async (route) => {
    if (await continueDocument(route)) return;
    await route.fulfill(json(users));
  });

const mockCreateUser = (
  page: Page,
  users: Array<{ id: number; name: string; role: string }>
) =>
  page.route('**/users**', async (route) => {
    if (await continueDocument(route)) return;
    const request = route.request();

    if (request.method() === 'GET') {
      await route.fulfill(json(users));
      return;
    }

    if (request.method() === 'POST') {
      const payload = JSON.parse((await request.postData()) ?? '{}');
      const newUser = { id: users.length + 1, ...payload };
      users.push(newUser);
      await route.fulfill(json(newUser, 201));
      return;
    }

    await route.continue();
  });

const fillUserName = (page: Page, name: string) =>
  page.getByPlaceholder('Enter name').fill(name);

const userListRow = (page: Page, name: string) =>
  page.locator('.users-list-panel .user-list-item', { hasText: name });

test('creates a new user on the Users page', async ({ page }) => {
  const users: Array<{ id: number; name: string; role: string }> = [];

  mockCreateUser(page, users);

  await page.goto('/users');

  await expect(
    page.getByRole('heading', { name: 'Users Management' })
  ).toBeVisible();
  await fillUserName(page, 'Test User');
  await page.getByRole('button', { name: 'Create user' }).click();

  await expect(userListRow(page, 'Test User')).toBeVisible();
  await expect(
    page.locator('.users-list-panel .user-role', { hasText: 'requester' })
  ).toBeVisible();
});
