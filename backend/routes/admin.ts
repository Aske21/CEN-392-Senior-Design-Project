import express from "express";
import { appDataSource } from "../core/data-source";
import { Users } from "../core/db/entity/user";
import { Order } from "../core/db/entity/order";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";
import { OrderService } from "../services/order-service";
import { OrderStatus } from "../enums/OrderStatus";
import { UserType } from "../enums/UserType";

const router = express.Router();
const orderService = new OrderService();

// GET /admin/users?page=1&limit=20
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;

    const userRepo = appDataSource.getRepository(Users);
    const [users, total] = await userRepo.findAndCount({ skip, take: limit });

    res.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET /admin/orders?page=1&limit=20
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "20");
    const skip = (page - 1) * limit;

    const orderRepo = appDataSource.getRepository(Order);
    const [orders, total] = await orderRepo.findAndCount({
      relations: ["user", "orderDetails", "orderDetails.product"],
      order: { orderDate: "DESC" as any },
      skip,
      take: limit,
    });

    res.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// PUT /admin/orders/:id/status
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: "status is required" });
        return;
      }

      // Validate status value
      if (!(Object.values(OrderStatus) as string[]).includes(status)) {
        res.status(400).json({ error: "Invalid order status" });
        return;
      }

      await orderService.updateOrderStatus(orderId, status as OrderStatus);

      res.json({ message: "Order status updated" });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
);

// DELETE /admin/users/:id
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userRepo = appDataSource.getRepository(Users);

      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await userRepo.delete(userId);
      res.json({ message: "User deleted" });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
);

// PUT /admin/users/:id/role
router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;

      if (!role) {
        res.status(400).json({ error: "role is required" });
        return;
      }

      if (!(Object.values(UserType) as string[]).includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }

      const userRepo = appDataSource.getRepository(Users);
      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      user.user_type = role as UserType;
      await userRepo.save(user);

      res.json({ message: "User role updated", user });
    } catch (error: any) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
);

export default router;
