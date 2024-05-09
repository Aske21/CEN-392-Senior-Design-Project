import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config";
import { appDataSource } from "./data-source";

import paymentRoutes from "../routes/payment";
import productRoutes from "../routes/product";
import { Product } from "./db/entity/product";
import { ProductService } from "../services/product-service";

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
  app.use("/payment", paymentRoutes);
  app.use("/product", productRoutes);
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
};
