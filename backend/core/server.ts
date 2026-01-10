import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import config from "./config";
import { appDataSource } from "./data-source";

import paymentRoutes from "../routes/payment";
import productRoutes from "../routes/product";
import inventoryRoutes from "../routes/inventory";
import categoryRoutes from "../routes/category";
import authRoutes from "../routes/auth";
import discountRoutes from "../routes/discount";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

const loadRoutes = () => {
  app.use("/auth", authRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/product", productRoutes);
  app.use("/inventory", inventoryRoutes);
  app.use("/category", categoryRoutes);
  app.use("/discount", discountRoutes);
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

  app.listen(config.port || 5000, () => {
    console.log(`Server started at port ${config.port || 5000}`);
  });
};
