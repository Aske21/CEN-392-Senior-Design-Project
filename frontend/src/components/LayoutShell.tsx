"use client";

import { usePathname } from "next/navigation";
import Container from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header";
import RegistrationBanner from "@/components/registration-banner";
import TopBar from "@/components/top-bar";

interface LayoutShellProps {
  locale: string;
  children: React.ReactNode;
}

export default function LayoutShell({ locale, children }: LayoutShellProps) {
  const pathname = usePathname();
  const adminRoute = pathname?.startsWith(`/${locale}/admin`);
  const adminLoginRoute = pathname === `/${locale}/admin-login`;

  if (adminRoute || adminLoginRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Header />
      <RegistrationBanner />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
