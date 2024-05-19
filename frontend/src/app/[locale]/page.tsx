"use client";

import BenefitsSection from "@/components/BenefitsSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import HeroSection from "@/components/HeroSection";
import { Separator } from "@/components/ui/separator";
import useGetCategories from "@/hooks/category/useGetCategories";

const Index = () => {
  const { data } = useGetCategories();

  return (
    <div className="container mx-auto py-8">
      <HeroSection />
      <Separator className="mb-4" />
      <CategoryCarousel categories={data ? data : []} />
      <Separator className="mt-4" />
      <BenefitsSection />
      <Separator className="mt-4" />
    </div>
  );
};

export default Index;
