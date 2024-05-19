import { Product } from "@/@types/product";
import ProductCard from "./ProductCard";
import { useTranslations } from "next-intl";

type Props = {
  data: Product[];
};

const NewlyAdded = ({ data }: Props) => {
  const t = useTranslations("Common");
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-10 text-center mt-10">
        {t("newly_added")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id as unknown as string}
            title={product.name}
            description={product.description}
            price={parseInt(product.price)}
            imageSrc={product.images[0] as string}
          />
        ))}
      </div>
    </div>
  );
};

export default NewlyAdded;
