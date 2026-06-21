"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import useGetProductById from "@/hooks/product/useGetProductById";
import useGetRecommendedProducts from "@/hooks/product/useGetRecommendedProducts";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import ProductImage from "@/components/product-image";
import ProductCard from "@/components/product-card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FiShoppingCart, FiTag, FiPackage } from "react-icons/fi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { data, isLoading, isError } = useGetProductById(params.id);
  
  const { data: recommendedProducts, isLoading: isLoadingRecommendations } = useGetRecommendedProducts(
    params.id,
    10,
    { enabled: !!data }
  );

  const carouselPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <div className="container mx-auto my-8 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:space-x-8 lg:space-x-12">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto my-8 px-4 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to fetch product details. Please try again later.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { id, name, description, price, category, brand, images } = data;
  const categoryLabel = typeof category === "string" 
    ? category 
    : category?.name || null;
  const categoryIdForLink = typeof category === "object" && category?.id ? category.id : null;
  
  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: id as unknown as string,
        title: name,
        description: description,
        price: parseInt(price),
        imageSrc: images?.[0] || "",
        quantity: 1,
      })
    );
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart`,
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[300px] md:top-4 md:right-4"
      ),
    });
  };

  const recommendedProductsFiltered = recommendedProducts?.filter(
    (product) => product.id !== id
  ).slice(0, 10) || [];

  return (
    <div className="container mx-auto my-8 px-4 max-w-7xl">
      <div className="mb-6">
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900 dark:hover:text-gray-100">Products</Link>
          {categoryIdForLink && (
            <>
              <span className="mx-2">/</span>
              <Link 
                href={`/products?categoryId=${categoryIdForLink}`}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                {categoryLabel}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{name}</span>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-12 mb-12">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="rounded-xl overflow-hidden aspect-square w-full relative bg-gray-100 dark:bg-gray-800 shadow-lg">
            <ProductImage
              src={images?.[0] || ""}
              alt={name}
              className="rounded-xl"
              fill
            />
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="mb-4">
            {categoryLabel && (
              <Link 
                href={categoryIdForLink ? `/products?categoryId=${categoryIdForLink}` : "/products"}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors mb-4"
              >
                <FiTag className="w-4 h-4" />
                {categoryLabel}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {name}
          </h1>

          <div className="mb-6">
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ${price}
            </p>
            {brand && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <FiPackage className="w-4 h-4" />
                <span className="text-sm">{brand}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="flex-1 sm:flex-none sm:min-w-[200px] h-12 text-base font-semibold"
            >
              <FiShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Link href="/cart" className="flex-1 sm:flex-none">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto sm:min-w-[200px] h-12 text-base"
              >
                View Cart
              </Button>
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {categoryLabel && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">Category</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {categoryLabel}
                  </span>
                </div>
              )}
              {brand && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">Brand</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoadingRecommendations ? (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Recommended Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        </div>
      ) : recommendedProductsFiltered.length > 0 ? (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Recommended Products
            </h2>
            {categoryIdForLink && (
              <Link href={`/products?categoryId=${categoryIdForLink}`}>
                <Button variant="outline">View All</Button>
              </Link>
            )}
          </div>
          <Carousel
            plugins={[carouselPlugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
            onMouseEnter={carouselPlugin.current.stop}
            onMouseLeave={carouselPlugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recommendedProductsFiltered.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                  <ProductCard
                    id={product.id as unknown as string}
                    title={product.name}
                    description={product.description}
                    price={parseInt(product.price)}
                    imageSrc={product.images?.[0] || ""}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      ) : null}
    </div>
  );
};

export default ProductPage;
