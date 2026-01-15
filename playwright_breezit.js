const { chromium } = require('playwright');

async function scrapeBreezit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log('Navigating to breezit.com...');
  
  try {
    await page.goto('https://breezit.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Get page title and URL
    const title = await page.title();
    console.log('Page title:', title);
    console.log('Current URL:', page.url());
    
    // Get the main content structure
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log('\n--- Page Content Preview ---');
    console.log(bodyText);
    
    // Look for navigation links
    console.log('\n--- Navigation Links ---');
    const navLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.map(l => ({
        text: l.innerText?.trim().substring(0, 50),
        href: l.href || l.getAttribute('href') || 'button'
      })).filter(l => l.text && l.text.length > 0).slice(0, 30);
    });
    console.log(JSON.stringify(navLinks, null, 2));
    
    // Look for search forms or venue-related elements
    console.log('\n--- Forms and Inputs ---');
    const forms = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select'));
      return inputs.map(i => ({
        type: i.type || i.tagName,
        placeholder: i.placeholder,
        name: i.name,
        id: i.id
      })).slice(0, 20);
    });
    console.log(JSON.stringify(forms, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

scrapeBreezit();
