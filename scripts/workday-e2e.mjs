import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0];
const page = context.pages().at(-1);
if (!page) throw new Error("No connected browser page found");
const cookies = page.getByRole("button", { name: /accept cookies/i });
if (await cookies.count()) await cookies.click();
const apply = page.getByRole("link", { name: /^Apply$/i });
if (await apply.count()) { const href = await apply.getAttribute("href"); if (href) await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60_000 }); }
const active = context.pages().at(-1);
await active.waitForTimeout(2500);
const report = { url: active.url(), title: await active.title(), headings: await active.locator("h1,h2,h3").allTextContents(), inputs: await active.locator("input,select,textarea").evaluateAll((fields) => fields.map((field) => ({ type: field.getAttribute("type"), name: field.getAttribute("name"), label: field.getAttribute("aria-label") ?? field.getAttribute("data-automation-id") ?? "" }))), buttons: await active.locator("button").allTextContents(), links: await active.locator("a").allTextContents() };
await mkdir("artifacts/workday", { recursive: true }); await active.screenshot({ path: "artifacts/workday/e2e-start.png", fullPage: true }); await writeFile("artifacts/workday/e2e-start.json", JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
