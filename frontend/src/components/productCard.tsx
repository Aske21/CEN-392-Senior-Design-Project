import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/lib/features/cart/cartSlice";
import placeholder from "../../public/placeholder.jpg";

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageSrc: string;
};

export default function ProductCard({
  id,
  title,
  description,
  price,
  imageSrc,
}: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({ id, title, description, price, imageSrc, quantity: 1 }));
  };

  return (
    <div className="container mx-auto my-10">
      <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
        <CardHeader className="relative">
          <img
            src={imageSrc as string}
            alt="Product Image"
            className="w-full h-48 object-cover" // Adjust height and width, and use object-cover for better image display
          />
        </CardHeader>
        <CardContent className="p-4">
          <Link href={`products/${id}`}>
            <CardTitle
              className="text-xl font-semibold mb-2 hover:underline cursor-pointer truncate"
              title={title}
            >
              {title}
            </CardTitle>
          </Link>
          <CardDescription className="text-gray-600 mb-4 truncate">
            {description}
          </CardDescription>
          <p className="text-gray-700 mb-2">${price}</p>
        </CardContent>
        <CardFooter className="p-4 bg-gray-100">
          <Button className="w-full" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
