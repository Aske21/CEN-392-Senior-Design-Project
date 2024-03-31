import React from "react";

import productsData from "./mockData";
import ProductCard from "@/components/productCard";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productsData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id as unknown as string}
            title={product.name}
            description={product.description}
            price={product.price}
            imageSrc={product.images[0]}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
