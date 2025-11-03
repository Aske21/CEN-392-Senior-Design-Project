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
};

export const initializeServer = async () => {
  await appDataSource.initialize();

  loadRoutes();

  app.listen(config.port, () => {
    console.log(`Server started at port ${config.port}`);
  });

  app.get("/", (req, res) => {
    res.send("Welcome to E-commerce for Multi-Product Development");
  });

  app.get("/health", (req, res) => {
    res.send("Healthy");
  });
};
