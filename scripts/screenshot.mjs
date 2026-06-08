#!/usr/bin/env node
// scripts/screenshot.mjs
// Captures app screenshots in both light and dark themes.
// Usage:
//   1) Make sure the app is running (npm run dev) or set NEXT_PUBLIC_APP_URL
//      to your deployed URL.
//   2) Run: npm run screenshots

import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const OUT_DIR = resolve(process.cwd(), "public/screenshots");

const PHONE = { width: 390, height: 844, deviceScaleFactor: 2 };
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 };

const TEST_EMAIL = `screenshot+${Date.now()}@atelier-demo.app`;
const TEST_PASSWORD = "demo-password-1234";
const TEST_NAME = "Demo User";

const PHONE_ROUTES = [
  { path: "/app", file: "today" },
  { path: "/app/habits", file: "habits" },
  { path: "/app/timer", file: "timer" },
  { path: "/app/journal", file: "journal" },
  { path: "/app/stats", file: "stats" },
];

const DESKTOP_ROUTES = [
  { path: "/app", file: "today-desktop" },
  { path: "/app/habits", file: "habits-desktop" },
];

function log(msg) {
  process.stdout.write(`▸ ${msg}\n`);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const key = "atelier-planner-v1";
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : {};
    if (!data.settings) data.settings = {};
    data.settings.theme = t;
    localStorage.setItem(key, JSON.stringify(data));
  }, theme);
  // Reload to apply theme
  await page.reload({ waitUntil: "networkidle" });
}

async function captureRoutes(page, routes, suffix) {
  for (const { path, file } of routes) {
    const filename = suffix ? `${file}-${suffix}.png` : `${file}.png`;
    log(`Capturing ${path} → ${filename}`);
    await page.goto(`${APP_URL}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: resolve(OUT_DIR, filename),
      fullPage: false,
    });
  }
}

async function main() {
  // Clear existing screenshots
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  // Check server is running
  try {
    const res = await fetch(APP_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok && res.status !== 304) {
      log(`Server responded ${res.status} at ${APP_URL}`);
      process.exit(1);
    }
  } catch {
    log(`Cannot reach ${APP_URL} — make sure npm run dev is running.`);
    process.exit(1);
  }

  // Launch browser
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" });
  } catch {
    log("System Chrome not found. Trying Playwright Chromium...");
    browser = await chromium.launch();
  }

  const context = await browser.newContext({
    viewport: PHONE,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();

  // Seed demo data
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("atelier-demo-seed", "1");
    } catch {}
  });

  // Sign up test account
  log(`Signing up ${TEST_EMAIL}`);
  await page.goto(`${APP_URL}/auth`, { waitUntil: "domcontentloaded" });
  await page.click('button:has-text("Sign up")');
  await page.fill("#auth-name", TEST_NAME);
  await page.fill("#auth-email", TEST_EMAIL);
  await page.fill("#auth-password", TEST_PASSWORD);
  await page.click('button[type="submit"]');
  try {
    await page.waitForURL(/\/app/, { timeout: 15000 });
  } catch {
    log("Signup redirect failed. Trying sign-in...");
    await page.goto(`${APP_URL}/auth`);
    await page.fill("#auth-email", TEST_EMAIL);
    await page.fill("#auth-password", TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/, { timeout: 15000 });
  }
  log("Signed in. Demo data seeded.");

  // Wait for seed data to settle
  await page.waitForTimeout(500);

  // ── Light theme screenshots ──
  log("── Light theme ──");
  await page.setViewportSize(PHONE);
  await captureRoutes(page, PHONE_ROUTES, "");
  await page.setViewportSize(DESKTOP);
  await captureRoutes(page, DESKTOP_ROUTES, "");

  // Auth page (phone only)
  log("Capturing /auth → auth.png");
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

  // Re-sign in for dark theme
  log("Re-signing in for dark theme...");
  await page.fill("#auth-email", TEST_EMAIL);
  await page.fill("#auth-password", TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/app/, { timeout: 15000 });
  await page.waitForTimeout(500);

  // ── Dark theme screenshots ──
  log("── Dark theme ──");
  await setTheme(page, "dark");
  await page.setViewportSize(PHONE);
  await captureRoutes(page, PHONE_ROUTES, "dark");
  await page.setViewportSize(DESKTOP);
  await captureRoutes(page, DESKTOP_ROUTES, "dark");

  // Dark auth page
  log("Capturing /auth → auth-dark.png");
  await page.setViewportSize(PHONE);
  await page.goto(`${APP_URL}/app/settings`, { waitUntil: "networkidle" });
  const signOutDark = page.locator('button:has-text("Sign out")');
  if (await signOutDark.count()) {
    await signOutDark.first().click();
    await page.waitForTimeout(1500);
  }
  await page.goto(`${APP_URL}/auth`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: resolve(OUT_DIR, "auth-dark.png"),
    fullPage: false,
  });

  await browser.close();
  log(`Done. ${14} screenshots written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});
