"use client";

import HeroSection from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import useGetCategories from "@/hooks/category/useGetCategories";
import { useTranslations } from "next-intl";

const Index = () => {
  const t = useTranslations("Landing");

  const { data, isLoading } = useGetCategories();
  console.log(data);

  return (
    <div className="container mx-auto py-8">
      <HeroSection />
      <CategoryCarousel categories={data ? data : []} />
    </div>
  );
};

export default Index;
