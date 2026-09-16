import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const contexts = browser.contexts();
const pages = contexts.flatMap((context) => context.pages());
if (!pages.length) throw new Error("No open browser pages found");
const page = pages.at(-1);
const report = {
  url: page.url(), title: await page.title(),
  headings: await page.locator("h1,h2,h3").allTextContents(),
  inputs: await page.locator("input,select,textarea").evaluateAll((fields) => fields.map((field) => ({ tag: field.tagName, type: field.getAttribute("type"), name: field.getAttribute("name"), label: field.getAttribute("aria-label") ?? field.getAttribute("data-automation-id") ?? "" }))),
  buttons: await page.locator("button").allTextContents(),
  links: await page.locator("a").evaluateAll((links) => links.map((link) => ({ text: (link.textContent ?? "").trim(), href: link.href })).filter((link) => /apply|sign in|resume/i.test(`${link.text} ${link.href}`))),
};
await mkdir("artifacts/workday", { recursive: true });
await page.screenshot({ path: "artifacts/workday/connected.png", fullPage: true });
await writeFile("artifacts/workday/connected.json", JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
