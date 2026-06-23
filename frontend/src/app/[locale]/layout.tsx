import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/hooks/QueryProvider";
import AuthInitializer from "@/components/auth-initializer";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { createRootMetadata } from "@/lib/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import { Toaster } from "@/components/ui/toaster";

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata({
  params,
}: RootLayoutProps): Promise<Metadata> {
  return {
    ...(await createRootMetadata(params.locale)),
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      shortcut: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <QueryProvider>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            <StoreProvider>
              <AuthInitializer>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Toaster />
                  {children}
                </ThemeProvider>
              </AuthInitializer>
            </StoreProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
