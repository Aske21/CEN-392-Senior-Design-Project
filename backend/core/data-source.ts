import { DataSource } from "typeorm";
import { Product } from "./db/entity/product";
import { Category } from "./db/entity/product_category";
import { ProductInventory } from "./db/entity/product_inventory";
import { Order } from "./db/entity/order";
import { OrderDetails } from "./db/entity/order_details";
import { Users } from "./db/entity/user";

export const appDataSource = new DataSource({
  type: "postgres",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  synchronize: true,
  logging: true,
  ssl: true,
  entities: [Product, Category, ProductInventory, Order, OrderDetails, Users],
  subscribers: [],
  migrations: [],
});
