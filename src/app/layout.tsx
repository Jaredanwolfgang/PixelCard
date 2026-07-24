import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/config";
import { SiteProvider } from "@/components/SiteProvider";

export function generateMetadata(): Metadata {
  const { site } = getSiteConfig();
  return {
    title: site.title || site.name,
    description: site.description,
    icons: {
      icon: [{ url: "/favicon.webp", type: "image/webp" }],
      shortcut: "/favicon.webp",
      apple: "/favicon.webp",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-glow" />
        <SiteProvider config={config}>{children}</SiteProvider>
      </body>
    </html>
  );
}
