import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('http://localhost:3000');
  });

  test('should display the home page correctly', async ({ page }) => {
    // Check if the heading is displayed
    await expect(page.getByRole('heading', { name: /manage your todo list/i })).toBeVisible();
    
    // Check if the add button is displayed
    await expect(page.getByTitle(/add a new todo item/i)).toBeVisible();
    
    // Check if the copyright message is displayed
    await expect(page.getByText(/©\s*2025\s*ToDo App/i)).toBeVisible();
  });

  test('should add a new todo item', async ({ page }) => {
    // Click the add button to open the dialog
    await page.getByTitle(/add a new todo item/i).click();
    
    // Fill in the task description
    await page.getByLabel(/Task Description/i).fill('Playwright Test Task');
    
    // Set the due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    await page.getByLabel(/Due Date/i).fill(formattedDate);
    
    // Select High priority
    await page.getByText(/🔥 High/i).click();
    
    // Click the Add Todo Item button
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    // Verify the new task appears in the list
    await expect(page.getByText('Playwright Test Task')).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
  });

  test('should mark a todo as complete', async ({ page }) => {
    // First add a todo item
    await page.getByTitle(/add a new todo item/i).click();
    await page.getByLabel(/Task Description/i).fill('Task to Complete');
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    // Find the complete button for the new task and click it
    const taskRow = page.getByText('Task to Complete').locator('..').locator('..');
    await taskRow.getByTitle(/mark as complete/i).click();
    
    // Verify the task is marked as complete
    await expect(taskRow.getByText(/completed/i)).toBeVisible();
  });

  test('should filter todos by status', async ({ page }) => {
    // Add an active todo
    await page.getByTitle(/add a new todo item/i).click();
    await page.getByLabel(/Task Description/i).fill('Active Task');
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    // Add a completed todo
    await page.getByTitle(/add a new todo item/i).click();
    await page.getByLabel(/Task Description/i).fill('Task to Complete');
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    // Mark the second task as complete
    const taskRow = page.getByText('Task to Complete').locator('..').locator('..');
    await taskRow.getByTitle(/mark as complete/i).click();
    
    // Filter by active tasks
    await page.getByTestId('filter-active').click();
    
    // Verify only active task is visible
    await expect(page.getByText('Active Task')).toBeVisible();
    await expect(page.getByText('Task to Complete')).not.toBeVisible();
    
    // Filter by completed tasks
    await page.getByTestId('filter-completed').click();
    
    // Verify only completed task is visible
    await expect(page.getByText('Active Task')).not.toBeVisible();
    await expect(page.getByText('Task to Complete')).toBeVisible();
    
    // Show all tasks
    await page.getByTestId('filter-all').click();
    
    // Verify both tasks are visible
    await expect(page.getByText('Active Task')).toBeVisible();
    await expect(page.getByText('Task to Complete')).toBeVisible();
  });

  test('should search for todos', async ({ page }) => {
    // Add two todos with different names
    await page.getByTitle(/add a new todo item/i).click();
    await page.getByLabel(/Task Description/i).fill('Buy groceries');
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    await page.getByTitle(/add a new todo item/i).click();
    await page.getByLabel(/Task Description/i).fill('Pay bills');
    await page.getByRole('button', { name: /Add Todo Item/i }).click();
    
    // Search for "groceries"
    await page.getByTestId('search-input').fill('groceries');
    
    // Verify only the matching task is visible
    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Pay bills')).not.toBeVisible();
    
    // Clear search
    await page.getByTestId('clear-search-button').click();
    
    // Verify both tasks are visible again
    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Pay bills')).toBeVisible();
  });
});