import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ToastProvider from "@/components/Toast/ToastProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LawyerTask",
  description: "The best task management tool for lawyers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
