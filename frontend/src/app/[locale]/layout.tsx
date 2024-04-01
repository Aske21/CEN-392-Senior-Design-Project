import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/hooks/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "@/components/container";
import { NextIntlClientProvider, useMessages } from "next-intl";
import StoreProvider from "./StoreProvider";

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
              <Header />
              <Container>{children}</Container>
              <Footer />
            </StoreProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
