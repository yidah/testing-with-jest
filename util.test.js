const { TestScheduler } = require('jest');
const { generateText, checkAndGenerate } = require('./util');
// importing puppeteer to test E2E
const puppeteer = require('puppeteer');

//Defining a test
test('should output name and age', () => {
  const text = generateText('Max', 29);
  expect(text).toBe('Max (29 years old)');
});

// Defining integration test
test('should generate a valid text output', () => {
  const text = checkAndGenerate('Max', 29);
  // the expectation is the same as in generateText
  // but has more dependencies that con cause it to fail
  // it could fail with the validateInput function or generateText
  expect(text).toBe('Max (29 years old)');
});

// Defining E2E test
test('should create an element with correct text and correct class', async () => {
  const browser = await puppeteer.launch({
    headless: false, // if we set it to true and comment the two lines before we will run on the background and will not show on the browser
    slowMo: 80, //speed to be able to see the clicks and changes
    args: ['--windwow-size=1920,1080'], // browser size
  });

  //load a page then navigate to my project page
  //this should open a page in chromioum with our page
  const page = await browser.newPage();
  await page.goto(
    'file:///C:/Users/yidah/DevProjects/JavaScript/31-testing/index.html'
  );

  // I will click on the input control with that id  <input type="text" id="name">
  await page.click('input#name');
  await page.type('input#name', 'Anna');
  await page.click('input#age');
  await page.type('input#age', '28');
  await page.click('button#btnAddUser');
  // $eval - to get access to an element. In this case the just create li text content 
  const finalText = await page.$eval('.user-item', el => el.textContent);
  expect(finalText).toBe('Anna (28 years old)');
// 10 seconds to allow for the test to finish
}, 10000);
