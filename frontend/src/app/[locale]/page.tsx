import { CarouselPlugin } from "@/components/product-carousel";
import { useTranslations } from "next-intl";

const Index = () => {
  const t = useTranslations("Landing");

  return (
    <div className="container mx-auto py-8">
      <CarouselPlugin />
    </div>
  );
};

export default Index;
