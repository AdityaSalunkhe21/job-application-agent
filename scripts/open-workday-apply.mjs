import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const page = browser.contexts().flatMap((context) => context.pages()).at(-1);
if (!page) throw new Error("No connected browser page found");
const apply = page.getByRole("link", { name: /^Apply$/i });
await apply.click();
await page.waitForTimeout(2_000);
const report = { url: page.url(), title: await page.title(), headings: await page.locator("h1,h2,h3").allTextContents(), inputs: await page.locator("input,select,textarea").count(), buttons: await page.locator("button").allTextContents() };
await mkdir("artifacts/workday", { recursive: true });
await page.screenshot({ path: "artifacts/workday/apply-start.png", fullPage: true });
await writeFile("artifacts/workday/apply-start.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
browser.disconnect();
