import AxiosClient from "@/lib/axios/axiosClient";

export interface OrderDetail {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
  };
}

export interface Order {
  id: number;
  paymentId: string;
  orderDate: string;
  totalAmount: number;
  discountAmount?: number;
  discountCode?: string;
  shippingAddress: string;
  status: string;
  orderDetails: OrderDetail[];
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class OrderApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async getOrderByPaymentId(paymentId: string): Promise<Order> {
    try {
      const response = await this.instance.get(`/payment/order/${paymentId}`);
      return response as unknown as Order;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch order details"
      );
    }
  }

  public async getUserOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedOrdersResponse> {
    try {
      const response = await this.instance.get(
        `/order/user-orders?page=${page}&limit=${limit}`
      );
      return response as unknown as PaginatedOrdersResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch user orders"
      );
    }
  }
}

export default OrderApi;
