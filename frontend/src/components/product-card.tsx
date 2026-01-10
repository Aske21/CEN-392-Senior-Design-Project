import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addItem } from "@/lib/features/cart/cartSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ProductImage from "./product-image";

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
  const { toast } = useToast();
  const dispatch = useDispatch();
  const t = useTranslations("Common");

  const handleAddToCart = () => {
    dispatch(addItem({ id, title, description, price, imageSrc, quantity: 1 }));
    toast({
      title: "Cart updated",
      description: "Item added to cart!",
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[200px] md:top-4 md:right-4"
      ),
    });
  };

  return (
    <Card className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
      <CardHeader className="relative p-0">
        <div className="w-full h-48 overflow-hidden">
          <ProductImage
            src={imageSrc as string}
            alt={title}
            className="w-full h-full object-cover"
            width={400}
            height={192}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`products/${id}`}>
          <CardTitle
            className="text-xl font-semibold mb-2 hover:underline cursor-pointer truncate"
            title={title}
          >
            {title}
          </CardTitle>
        </Link>
        <CardDescription className="mb-4 truncate flex-1">
          {description}
        </CardDescription>
        <p className="mb-2 text-lg font-semibold">${price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          {t("add_to_cart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
