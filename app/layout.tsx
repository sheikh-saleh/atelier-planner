import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DataProvider } from "@/components/providers/DataProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";
import { KeyboardShortcuts } from "@/components/motion";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://atelier-planner.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Atelier",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any (PWA)",
  description:
    "A classical, minimal daily routine planner with habit tracking, Pomodoro focus, and journaling. Free, offline, and privacy-first.",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Atelier — A daily routine planner worth keeping",
    template: "%s — Atelier",
  },
  description:
    "A classical, minimal daily routine planner with habit tracking, Pomodoro focus, and journaling. Free, offline, and privacy-first.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atelier",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Atelier",
    title: "Atelier — A daily routine planner worth keeping",
    description:
      "A classical, minimal daily routine planner. Free, offline, and privacy-first.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier — A daily routine planner worth keeping",
    description:
      "A classical, minimal daily routine planner. Free, offline, and privacy-first.",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2C2A26",
};

const themeScript = `
(function() {
  try {
    var raw = localStorage.getItem('atelier-planner-v1');
    var theme = 'light';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.settings) {
        theme = parsed.settings.theme || 'light';
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme === 'sepia') document.documentElement.classList.add('sepia');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon-48.png" sizes="48x48" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <LazyMotion features={domAnimation}>
          <AuthProvider>
            <DataProvider>
              <KeyboardShortcuts />
              <ThemeProvider>
                <RequireAuth>
                  {children}
                </RequireAuth>
              </ThemeProvider>
            </DataProvider>
          </AuthProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
