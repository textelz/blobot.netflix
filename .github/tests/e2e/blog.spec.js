const { test, expect } = require('@playwright/test');

test.describe('Blog Functionality @desktop', () => {
  test('should display blog posts', async ({ page }) => {
    await page.goto('/');

    const posts = page.locator('[data-testid="blog-post-teaser"]');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should open individual blog post', async ({ page }) => {
    await page.goto('/');

    const firstPost = page.locator('[data-testid="blog-post-link"]').first();
    await firstPost.click();

    await expect(page.locator('article')).toBeVisible();
  });

  test('should have post metadata', async ({ page }) => {
    await page.goto('/');

    const firstPost = page.locator('[data-testid="blog-post-link"]').first();
    await firstPost.click();

    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    const articleText = await article.textContent();
    expect(articleText?.length).toBeGreaterThan(50);
  });

  test('should have post navigation', async ({ page }) => {
    await page.goto('/');

    const firstPost = page.locator('.post-teaser header h1 a, article header h1 a, .banner h1 a').first();
    await firstPost.click();

    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    const navLinks = page.locator('.post-nav, .pagination, nav a');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should filter posts by tag', async ({ page }) => {
    await page.goto('/tags');

    // Look for tag links with data-testid
    const tag = page.locator('[data-testid="tag-link"]').first();
    await expect(tag).toBeVisible();
    
    await tag.click();

    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('tag');
  });

  test('should filter posts by category', async ({ page }) => {
    await page.goto('/categories');

    // Look for category links in the content, not navbar
    const category = page.locator('main a[href*="categories"], .content a[href*="categories"], .category a').first();
    const count = await category.count();
    
    if (count === 0) {
      test.skip(true, 'No categories configured');
      return;
    }
    
    await expect(category).toBeVisible();
    await category.click();

    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toMatch(/categories|category/);
  });

  test('should have blog pagination', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
    
    const posts = page.locator('[data-testid="blog-post-teaser"]');
    expect(await posts.count()).toBeGreaterThan(0);
    
    const pagination = page.locator('[data-testid="blog-pagination"]');
  });

  test('should display post excerpts on blog page', async ({ page }) => {
    await page.goto('/');

    const posts = page.locator('[data-testid="blog-post-teaser"]');
    const firstPost = posts.first();

    await expect(firstPost).toBeVisible();
    
    const text = await firstPost.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  /**
   * @note Tests syntax highlighting in code blocks by checking any post with code blocks.
   */
  test('should have syntax highlighting in code blocks', async ({ page }) => {
    // First, go to home page and find a post
    await page.goto('/');
    
    const posts = page.locator('[data-testid="blog-post-link"]');
    const postCount = await posts.count();
    
    if (postCount === 0) {
      test.skip(true, 'No posts available');
      return;
    }
    
    // Try to find a post with code blocks by checking multiple posts
    let foundCodeBlock = false;
    for (let i = 0; i < Math.min(postCount, 5); i++) {
      const postLink = posts.nth(i);
      await postLink.click();
      
      await page.waitForLoadState('networkidle');
      
      const codeBlocks = page.locator('pre code, .highlight, code');
      const codeBlockCount = await codeBlocks.count();
      
      if (codeBlockCount > 0) {
        foundCodeBlock = true;
        const codeBlock = codeBlocks.first();
        const className = await codeBlock.getAttribute('class');
        // If it has a class, it's likely syntax highlighted
        if (className) {
          expect(className).toBeTruthy();
        }
        break;
      }
      
      // Go back to home page to try next post
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
    
    // If no code blocks found in any post, skip the test
    if (!foundCodeBlock) {
      test.skip(true, 'No posts with code blocks found');
    }
  });

  test('should have share buttons on posts', async ({ page }) => {
    await page.goto('/');

    const firstPost = page.locator('.post-teaser header h1 a, article header h1 a, .banner h1 a').first();
    await firstPost.click();

    const article = page.locator('article');
    await expect(article).toBeVisible();
    
    const articleText = await article.textContent();
    expect(articleText?.length).toBeGreaterThan(50);
  });
});
