"use client";

import { Button } from "@/components/ui/button";
import useGetProductById from "@/hooks/product/useGetProductById";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useDispatch } from "react-redux";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetProductById(params.id);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error: Unable to fetch product details</div>;
  }
  const { id, name, description, price, category, brand, images } = data;
  const categoryLabel = typeof category === "string" ? category : category?.name || "N/A";
  
  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: id as unknown as string,
        title: name,
        description: description,
        price: parseInt(price),
        imageSrc: images[0],
        quantity: 1,
      })
    );
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="md:w-1/2">
            <img src={images[0]} alt={name} width={600} height={600} />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-semibold mb-4">{name}</h1>
            <p className="mb-4">{description}</p>
            <p className="mb-2">Price: ${price}</p>
            <p className="mb-2">Category: {categoryLabel}</p>
            <p className="mb-2">Brand: {brand}</p>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
