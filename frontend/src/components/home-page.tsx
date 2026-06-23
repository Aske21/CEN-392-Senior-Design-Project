"use client";

import BenefitsSection from "@/components/benefits-section";
import { CategoryCarousel } from "@/components/category-carousel";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-works-section";
import LandingCtaSection from "@/components/landing-cta-section";
import NewlyAdded from "@/components/newly-added";
import useGetCategories from "@/hooks/category/useGetCategories";
import useGetNewlyAddedProducts from "@/hooks/product/useGetNewlyAddedProducts";

export default function HomePage() {
  const { data: categories } = useGetCategories();
  const { data: newlyAdded } = useGetNewlyAddedProducts();

  return (
    <div className="space-y-4 py-8 md:space-y-8">
      <HeroSection />
      <CategoryCarousel categories={categories ? categories : []} />
      <NewlyAdded data={newlyAdded ? newlyAdded : []} />
      <BenefitsSection />
      <HowItWorksSection />
      <LandingCtaSection />
    </div>
  );
}
