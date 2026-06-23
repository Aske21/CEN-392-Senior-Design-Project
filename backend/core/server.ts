import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import config from "./config";
import { appDataSource } from "./data-source";

import paymentRoutes, { webhookRouter } from "../routes/payment";
import productRoutes from "../routes/product";
import inventoryRoutes from "../routes/inventory";
import categoryRoutes from "../routes/category";
import authRoutes from "../routes/auth";
import discountRoutes from "../routes/discount";
import orderRoutes from "../routes/order";
import uploadRoutes from "../routes/upload";
import adminRoutes from "../routes/admin";

const app = express();

// Trust proxy - required when behind a reverse proxy or load balancer
// This allows Express to correctly handle X-Forwarded-* headers
app.set("trust proxy", true);

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Must be false when origin is "*"
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(bodyParser.json());

const loadRoutes = () => {
  app.use("/payment", webhookRouter);
  app.use("/auth", authRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/product", productRoutes);
  app.use("/inventory", inventoryRoutes);
  app.use("/category", categoryRoutes);
  app.use("/discount", discountRoutes);
  app.use("/order", orderRoutes);
  app.use("/admin/uploads", uploadRoutes);
  app.use("/admin", adminRoutes);
};

export const initializeServer = async () => {
  await appDataSource.initialize();

  // Health check route - check before other routes for faster response
  app.get("/health", async (req, res) => {
    try {
      // Check database connection
      const isConnected = appDataSource.isInitialized;

      if (isConnected) {
        // Optional: Test actual query
        await appDataSource.query("SELECT 1");

        res.status(200).json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: "connected",
          uptime: process.uptime(),
        });
      } else {
        res.status(503).json({
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: "disconnected",
        });
      }
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.get("/", (req, res) => {
    res.send("Welcome to E-commerce for Multi-Product Development");
  });

  loadRoutes();

  app.listen(config.port || 8080, () => {
    console.log(`Server started at port ${config.port || 8080}`);
  });
};
