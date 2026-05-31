const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  await page.goto('http://localhost:3001'); // Port from the error EADDRINUSE above
  // Wait for login or directly try to click
  await new Promise(r => setTimeout(r, 2000));
  
  // Assuming we need to login first? If we need to login, let's login
  try {
    await page.click('button[type="submit"]'); // Just click login if there is one
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {}

  // Click market tab
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Market')) {
        await btn.click();
        console.log('Clicked Market Tab');
        break;
      }
    }
  } catch(e) {
    console.log("Could not find Market tab");
  }

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
