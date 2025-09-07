import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ConditionalNavigation } from "@/components/conditional-navigation";
import { BanNotification } from "@/components/auth/ban-notification";
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/error-boundary'
import { Suspense } from 'react'
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "NextByte - Learn Tech Skills Online",
  description: "Master frontend engineering, graphic design, logo design, video editing and more with our comprehensive online courses. Start your tech career today!",

  keywords: [
    "NextByte Academy",
    "NextByte",
    "NextByte IT Institute",
    "NextByte IT",
    "NextByte IT Institute",
    "Learn Web Development",
    "Frontend Engineering",
    "JavaScript Course",
    "React Course",
    "Next.js Course",
    "Tailwind CSS",
    "Full Stack Development",
    "Graphic Design Course",
    "Logo Design",
    "UI UX Design",
    "Figma",
    "Video Editing Course",
    "Adobe Premiere Pro",
    "After Effects",
    "Freelancing Course",
    "Fiverr Training",
    "Upwork Training",
    "Work From Home",
    "Learn Tech Skills Online",
    "Start Tech Career",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Toaster />
              <Suspense fallback={null}>
                <BanNotification />
              </Suspense>
              <div className="flex flex-col min-h-screen">
                <Suspense fallback={null}>
                  <ConditionalNavigation />
                </Suspense>
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
