import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/hooks/QueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children, params }: RootLayoutProps) {
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
          <>{children}</>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
