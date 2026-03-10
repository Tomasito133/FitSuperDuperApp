"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#f97316",
          colorTextOnPrimaryBackground: "#ffffff",
        },
      }}
    >
      <html lang="ru">
        <body className={`${inter.className} bg-gray-950 min-h-screen overflow-x-hidden`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
