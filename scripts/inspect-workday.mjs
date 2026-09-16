import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const url = process.argv[2];
if (!url) throw new Error("Usage: npm run inspect:workday -- <workday-url>");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
await page.waitForTimeout(2_000);
const report = {
  url: page.url(), title: await page.title(),
  headings: await page.locator("h1,h2,h3").allTextContents(),
  inputs: await page.locator("input,select,textarea").evaluateAll((fields) => fields.map((field) => ({ tag: field.tagName, type: field.getAttribute("type"), name: field.getAttribute("name"), label: field.getAttribute("aria-label") ?? field.getAttribute("data-automation-id") ?? "" }))),
  buttons: await page.locator("button").allTextContents(),
};
await mkdir("artifacts/workday", { recursive: true });
await page.screenshot({ path: "artifacts/workday/latest.png", fullPage: true });
await writeFile("artifacts/workday/latest.json", JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
