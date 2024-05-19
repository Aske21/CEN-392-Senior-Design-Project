"use client";

import BenefitsSection from "@/components/BenefitsSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import HeroSection from "@/components/HeroSection";
import NewlyAdded from "@/components/NewlyAdded";
import { Separator } from "@/components/ui/separator";
import useGetCategories from "@/hooks/category/useGetCategories";
import useGetNewlyAddedProducts from "@/hooks/product/useGetNewlyAddedProducts";

const Index = () => {
  const { data: categories } = useGetCategories();
  const { data: newlyAdded } = useGetNewlyAddedProducts();

  return (
    <div className="container mx-auto py-8">
      <HeroSection />
      <Separator className="mb-4" />
      <CategoryCarousel categories={categories ? categories : []} />
      <Separator className="mt-4" />
      <BenefitsSection />
      <Separator className="mt-4" />
      <NewlyAdded data={newlyAdded ? newlyAdded : []} />
    </div>
  );
};

export default Index;
