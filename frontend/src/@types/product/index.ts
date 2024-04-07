export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  stockQuantity: number;
  images: string[];
  attributes: {
    layout: string;
    switch: string;
    backlight: string;
    case_material: string;
  };
  createdAt: string;
  updatedAt: string;
};
