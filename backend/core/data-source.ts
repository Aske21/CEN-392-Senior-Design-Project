import { DataSource } from "typeorm";
import { Product } from "./db/entity/product";
import { Category } from "./db/entity/category";
import { Inventory } from "./db/entity/inventory";
import { Order } from "./db/entity/order";
import { OrderDetails } from "./db/entity/orderDetails";
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
  entities: [Product, Category, Inventory, Order, OrderDetails, Users],
  subscribers: [],
  migrations: [],
});
