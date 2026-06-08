#!/usr/bin/env node
// scripts/screenshot.mjs
// Captures marketing screenshots from a running dev/prod instance.
// Usage:
//   1) Make sure the app is running (npm run dev) or set NEXT_PUBLIC_APP_URL
//      to your deployed URL.
//   2) Run: npm run screenshots
//
// What it does:
//   - Sets the atelier-demo-seed localStorage flag for every navigation
//   - Signs up a fresh test account so we have an authenticated session
//   - Captures /app, /app/habits, /app/timer, /app/journal, /app/stats
//     at iPhone 14 (390x844) viewport
//   - Re-captures the same routes at desktop (1280x800)
//   - Signs out and captures /auth

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const OUT_DIR = resolve(process.cwd(), "public/screenshots");

const PHONE = { width: 390, height: 844, deviceScaleFactor: 2 };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 };

const TEST_EMAIL = `screenshot+${Date.now()}@atelier-demo.app`;
const TEST_PASSWORD = "demo-password-1234";
const TEST_NAME = "Demo User";

const PHONE_ROUTES = [
  { path: "/app", file: "today.png" },
  { path: "/app/habits", file: "habits.png" },
  { path: "/app/timer", file: "timer.png" },
  { path: "/app/journal", file: "journal.png" },
  { path: "/app/stats", file: "stats.png" },
];

const DESKTOP_ROUTES = [
  { path: "/app", file: "today-desktop.png" },
  { path: "/app/habits", file: "habits-desktop.png" },
];

function log(msg) {
  process.stdout.write(`▸ ${msg}\n`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Check server is running
  try {
    const res = await fetch(APP_URL, { method: "HEAD", signal: AbortSignal.timeout(3000) });
    if (!res.ok && res.status !== 304) {
      log(`Server responded ${res.status} at ${APP_URL} — make sure dev server is running.`);
      process.exit(1);
    }
  } catch {
    log(`Cannot reach ${APP_URL} — make sure npm run dev is running in another terminal.`);
    process.exit(1);
  }

  // Use system Chrome (no Playwright download needed)
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" });
  } catch {
    log("System Chrome not found. Trying Playwright Chromium fallback...");
    browser = await chromium.launch();
  }
  const context = await browser.newContext({
    viewport: PHONE,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();

  // 1) Seed flag for every navigation
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("atelier-demo-seed", "1");
    } catch {}
  });

  // 2) Sign up a fresh test account
  log(`Signing up test account ${TEST_EMAIL}`);
  await page.goto(`${APP_URL}/auth`, { waitUntil: "domcontentloaded" });
  await page.click('button:has-text("Sign up")');
  await page.fill("#auth-name", TEST_NAME);
  await page.fill("#auth-email", TEST_EMAIL);
  await page.fill("#auth-password", TEST_PASSWORD);
  await page.click('button[type="submit"]');
  try {
    await page.waitForURL(/\/app/, { timeout: 15000 });
  } catch {
    log("Signup did not auto-redirect. Trying sign-in fallback (account may already exist).");
    await page.goto(`${APP_URL}/auth`);
    await page.fill("#auth-email", TEST_EMAIL);
    await page.fill("#auth-password", TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 15000 });
  }
  log("Signed in.");

  // 3) Capture phone screenshots
  await page.setViewportSize(PHONE);
  for (const { path, file } of PHONE_ROUTES) {
    log(`Capturing phone ${path} → ${file}`);
    await page.goto(`${APP_URL}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: resolve(OUT_DIR, file),
      fullPage: false,
    });
  }

  // 4) Capture desktop screenshots
  await page.setViewportSize(DESKTOP);
  for (const { path, file } of DESKTOP_ROUTES) {
    log(`Capturing desktop ${path} → ${file}`);
    await page.goto(`${APP_URL}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: resolve(OUT_DIR, file),
      fullPage: false,
    });
  }

  // 5) Capture auth page (signed out)
  log("Signing out for /auth capture");
  await page.setViewportSize(PHONE);
  await page.goto(`${APP_URL}/app/settings`, { waitUntil: "networkidle" });
  const signOut = page.locator('button:has-text("Sign out")');
  if (await signOut.count()) {
    await signOut.first().click();
    await page.waitForTimeout(1500);
  }
  await page.goto(`${APP_URL}/auth`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(OUT_DIR, "auth.png"),
    fullPage: false,
  });

  await browser.close();
  log(`Done. Screenshots written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});
