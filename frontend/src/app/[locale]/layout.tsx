import Container from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/hooks/QueryProvider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Inter as FontSans } from "next/font/google";
import StoreProvider from "./StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "@/components/top-bar";

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children, params }: RootLayoutProps) {
  const messages = useMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <QueryProvider>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            <StoreProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster />
                <TopBar />
                <Header />
                <Container>{children}</Container>
                <Footer />
              </ThemeProvider>
            </StoreProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
