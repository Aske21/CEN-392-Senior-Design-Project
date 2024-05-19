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
    <div className="container mx-auto my-10">
      <Card className=" rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
        <CardHeader className="relative">
          <img
            src={imageSrc as string}
            alt="Product Image"
            className="w-full h-48 object-cover"
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
          <CardDescription className="mb-4 truncate">
            {description}
          </CardDescription>
          <p className="mb-2">${price}</p>
        </CardContent>
        <CardFooter className="p-4 ">
          <Button className="w-full" onClick={handleAddToCart}>
            {t("add_to_cart")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
