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
import placeholder from "../../public/placeholder.jpg";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="container mx-auto my-10">
      <Card className="bg-white max-w-sm rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
        <CardHeader className="relative">
          <Image
            src={placeholder}
            alt="Product Image"
            className="w-full h-48 bg-contain bg-center"
          />
        </CardHeader>
        <CardContent className="p-4">
          <Link href={`products/${id}`}>
            <CardTitle className="text-xl font-semibold mb-2 hover:underline">
              {title}
            </CardTitle>
          </Link>
          <CardDescription className="text-gray-600 mb-4">
            {description}
          </CardDescription>
          <p className="text-gray-700 mb-2">${price}</p>
        </CardContent>
        <CardFooter className="p-4 bg-gray-100 w-full">
          <Button className="w-full">Add to cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
