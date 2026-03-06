import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "転職OS MVP",
  description: "AIと話すだけで、転職準備を前に進める日本向けWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
