import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/contexts/AuthContexte";
import { LanguageProvider } from "@/lib/contexts/LanguageContexte";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/lib/contexts/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiely — Invitations digitales premium pour mariages en Afrique",
  description: "Créez des invitations de mariage digitales élégantes avec QR code unique. Gestion d'invités, check-in en temps réel et partage WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <ReactQueryProvider>
            <AuthProvider>
              <LanguageProvider>
                {children}

                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  theme="dark"
                />
              </LanguageProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
