import { useTranslations } from "next-intl";

const Index = () => {
  const t = useTranslations("Landing");

  return <div className="container mx-auto py-8">Products</div>;
};

export default Index;
