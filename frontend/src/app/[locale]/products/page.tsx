"use client";

import ProductCard from "@/components/productCard";
import useGetProducts from "@/hooks/product/useGetProducts";

const Products = () => {
  const { data } = useGetProducts();

  return (
    <div className="container mx-auto py-8">
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

export default Products;
