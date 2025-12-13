"use client";

import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";
import { ConditionalNavigation } from "@/components/conditional-navigation";
import { BanNotification } from "@/components/auth/ban-notification";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MessengerButton } from "@/components/messenger-button";
import { Toaster } from "sonner";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>

            {/* Portal components */}
            <Toaster />
            <BanNotification />

            <Suspense fallback={<div />}>
              <div className="flex flex-col min-h-screen">
                <ConditionalNavigation />
                <main className="flex-grow">{children}</main>
                <Footer />
                <div className="flex flex-col gap-5">
                  <WhatsAppButton />
                  {/* <MessengerButton /> */}
                </div>
              </div>
            </Suspense>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
