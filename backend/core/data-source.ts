import { DataSource } from "typeorm";
import { Product } from "./db/entity/product";
import { ProductCategory } from "./db/entity/product_category";
import { ProductInventory } from "./db/entity/product_inventory";
import { Order } from "./db/entity/order";
import { OrderDetails } from "./db/entity/order_details";
import { Users } from "./db/entity/user";
import { ProductDiscount } from "./db/entity/product_discount";
import { DiscountUsage } from "./db/entity/discount_usage";

export const appDataSource = new DataSource({
  type: "postgres",
  database: process.env.RDS_DB_NAME || process.env.DB_DATABASE,
  username: process.env.RDS_USERNAME || process.env.DB_USERNAME,
  password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
  host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
  port: parseInt(process.env.RDS_PORT || process.env.DB_PORT || "5432"),
  synchronize: true,
  logging: true,
  ssl:
    process.env.DB_SSL === "true" || process.env.DB_SSL === "1"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  entities: [
    Product,
    ProductCategory,
    ProductInventory,
    ProductDiscount,
    DiscountUsage,
    Order,
    OrderDetails,
    Users,
  ],
  subscribers: [],
  migrations: [],
});
