import { Request, Response } from "express";
import { OrderService } from "../services/order-service";

class OrderController {
  async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orderService = new OrderService();
      const result = await orderService.getOrdersByUserId(user.id, page, limit);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default OrderController;
