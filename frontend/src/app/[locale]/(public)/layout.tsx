import Container from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header";
import RegistrationBanner from "@/components/registration-banner";
import TopBar from "@/components/top-bar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
