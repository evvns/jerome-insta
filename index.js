//  /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$ 
// /$$__  $$| $$$ | $$ /$$__  $$ /$$__  $$
//| $$  \__/| $$$$| $$| $$  \ $$| $$  \ $$
//| $$ /$$$$| $$ $$ $$| $$$$$$$$| $$$$$$$$
//| $$|_  $$| $$  $$$$| $$__  $$| $$__  $$
//| $$  \ $$| $$\  $$$| $$  | $$| $$  | $$
//|  $$$$$$/| $$ \  $$| $$  | $$| $$  | $$
// \______/ |__/  \__/|__/  |__/|__/  |__/ International
 
// Making the internet safer for homosexual black men since 2022.

// Proprietary source code by GNAA
const puppeteer = require('puppeteer');
const openai = require('openai');

const openaiApiKey = '';
openai.apiKey = openaiApiKey; // npm i openai && npm i puppeteer && chmod +rwx .
const openaiClient = openai.api;

async function generateResponse(prompt) {
  const basePrompt = "im gay as fuck";
  const promptWithBase = `${basePrompt}\n\nUser: ${prompt}\nAI:`;
  const response = await openaiClient.completions.create({
    engine: 'davinci', // changeable to text-davinci-003 or gpt3.5-turbo
    prompt: promptWithBase,
    maxTokens: 1024,
    temperature: 0.5,
    n: 1,
    stop: '\n\n',
  });
  return response.data.choices[0].text.trim();
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');
  await page.waitForSelector('input[name="username"]');
// stupidly insecure method but it was gonna be an env var anyways
  const username = '';
  const password = '';

  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  console.log('jerome online. racism pending');

  await page.goto('https://www.instagram.com/direct/inbox/');
  await page.waitForSelector('button[aria-label="New Message"]');
// something is definitely wrong here and i cant figure out why it wont work lmao
  while (true) {
    await page.waitForSelector('div[data-testid="inbox"]', { timeout: 0 });
    const lastMessage = await page.$eval(
      'div[data-testid="inbox"] div[role="button"] span[aria-label]',
      (el) => el.getAttribute('aria-label')
    );
    const lastMessageSender = await page.$eval(
      'div[data-testid="inbox"] div[role="button"] div[aria-hidden="true"]',
      (el) => el.textContent
    );

    if (lastMessageSender !== 'You') {
      const response = await generateResponse(lastMessage);
      await page.click('button[aria-label="New Message"]');
      await page.waitForSelector('input[placeholder="Search"]');
      await page.type('input[placeholder="Search"]', `${lastMessageSender}\n`);
      await page.waitForSelector('div[role="button"][aria-label]');
      await page.click('div[role="button"][aria-label]');
      await page.waitForSelector('textarea[placeholder="Message..."]');
      await page.type('textarea[placeholder="Message..."]', `${response}\n`);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await page.reload();
  }
}

main().catch((error) => console.error('An error occurred:', error));
