"use client";

import { usePathname } from "next/navigation"; // Import for path checking
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/feed/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Pages where you don't want to show the navbar (e.g., login, register)
  const noNavbarRoutes = ["/login", "/register"];
  
  // Check if the current path is in this list
  const showNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/common.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* Navbar will render conditionally */}
        {showNavbar && <Navbar />}

        {children}
      </body>
    </html>
  );
}