import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import { Toaster } from "sonner";
import SupabaseProvider from "@/provider/SupabaseProvider";

const geistSans = Inter({
  subsets: ["latin"], // Specify the necessary subsets
  display: "swap", // Optional: Controls font display behavior
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocClerk",
  description: "DocClerk: Your sidekick to doc your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.className} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SupabaseProvider>
              <div className="font-sans flex flex-col w-full h-full">
                <Header />
                <main className="w-full flex-1 flex flex-col px-3">
                  {children}
                </main>
                <Toaster closeButton />
                <Footer />
              </div>
            </SupabaseProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
