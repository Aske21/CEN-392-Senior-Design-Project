import HomePage from "@/components/home-page";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type HomePageProps = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  return createMetadata(params.locale, "home");
}

export default function Page() {
  return <HomePage />;
}
