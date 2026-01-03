const { test, expect } = require('@playwright/test');
const { openMobileMenu } = require('./helpers');

test.describe('Navigation and Routing @desktop', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Type on Strap/);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const aboutLink = page.locator('nav a[href*="about"], .navbar a[href*="about"]');
    const linkCount = await aboutLink.count();
    if (linkCount > 0) {
      await aboutLink.click();
    } else {
      await page.goto('/about');
    }
    await expect(page).toHaveURL(/about/);
    await expect(page.locator('h1, h2')).toContainText(/About|Welcome/i);
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    const blogLink = page.locator('a[href*="blog"]').first();
    await blogLink.click();
    await expect(page).toHaveURL(/blog/);
  });

  test('should navigate to portfolio page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const portfolioLink = page.locator('nav a[href*="portfolio"], .navbar a[href*="portfolio"], a[href*="portfolio"]');
    const linkCount = await portfolioLink.count();
    if (linkCount > 0) {
      await portfolioLink.first().click();
    } else {
      await page.goto('/portfolio');
    }
    await expect(page).toHaveURL(/portfolio/);
  });

  test('should navigate to tags page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href*="tags"]');
    await expect(page).toHaveURL(/tags/);
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.goto('/categories');
    await expect(page).toHaveURL(/categories/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href*="search"]');
    await expect(page).toHaveURL(/search/);
  });

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const galleryLink = page.locator('nav a[href*="gallery"], .navbar a[href*="gallery"], a[href*="gallery"]');
    const linkCount = await galleryLink.count();
    if (linkCount > 0) {
      await galleryLink.first().click();
    } else {
      await page.goto('/gallery');
    }
    await expect(page).toHaveURL(/gallery/);
  });

  test('should have working navbar on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/blog', '/portfolio'];

    for (const url of pages) {
      await page.goto(url);
      const navbar = page.locator('nav, .navbar');
      await expect(navbar).toBeVisible();
    }
  });

  test('should have working footer on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/blog', '/portfolio'];

    for (const url of pages) {
      await page.goto(url);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('should handle 404 page', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-12345');
    expect(response?.status()).toBe(404);
  });

});

// Mobile-specific navigation tests
test.describe('Navigation and Routing @mobile', () => {
  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const aboutLink = page.locator('nav a[href*="about"], .navbar a[href*="about"]');
    const linkCount = await aboutLink.count();
    if (linkCount > 0) {
      await openMobileMenu(page);
      await aboutLink.click();
    } else {
      await page.goto('/about');
    }
    await expect(page).toHaveURL(/about/);
    await expect(page.locator('h1, h2')).toContainText(/About|Welcome/i);
  });

  test('should navigate to portfolio page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const portfolioLink = page.locator('nav a[href*="portfolio"], .navbar a[href*="portfolio"], a[href*="portfolio"]');
    const linkCount = await portfolioLink.count();
    if (linkCount > 0) {
      await openMobileMenu(page);
      await portfolioLink.first().click();
    } else {
      await page.goto('/portfolio');
    }
    await expect(page).toHaveURL(/portfolio/);
  });

  test('should navigate to tags page', async ({ page }) => {
    await page.goto('/');
    await openMobileMenu(page);
    await page.click('a[href*="tags"]');
    await expect(page).toHaveURL(/tags/);
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');
    await openMobileMenu(page);
    await page.click('a[href*="search"]');
    await expect(page).toHaveURL(/search/);
  });

  test('should navigate to gallery page', async ({ page }) => {
    await page.goto('/');
    // Try to click nav link, but if it doesn't exist (hide: true), navigate directly
    const galleryLink = page.locator('nav a[href*="gallery"], .navbar a[href*="gallery"], a[href*="gallery"]');
    const linkCount = await galleryLink.count();
    if (linkCount > 0) {
      await openMobileMenu(page);
      await galleryLink.first().click();
    } else {
      await page.goto('/gallery');
    }
    await expect(page).toHaveURL(/gallery/);
  });

  test('should have responsive navbar on mobile', async ({ page }) => {
    await page.goto('/');
    await openMobileMenu(page);
    
    const menu = page.locator('nav ul, .navbar ul');
    await expect(menu).toBeVisible();
  });
});
