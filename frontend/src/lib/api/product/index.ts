import { Product } from "@/@types/product";
import AxiosClient from "@/lib/axios/axiosClient";

class ProductApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const response = await this.instance.get("/product");
      return response as unknown as Product[];
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    try {
      const response = await this.instance.get(`/product/${id}`);
      return response as unknown as Product;
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  public async getNewlyAddedProducts(): Promise<Product[]> {
    try {
      const response = await this.instance.get("/product/newlyadded");
      return response as unknown as Product[];
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }
}

export default ProductApi;
