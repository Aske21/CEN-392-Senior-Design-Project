import { DataSource } from "typeorm";
import { Product } from "./db/entity/product";

export const appDataSource = new DataSource({
  type: "postgres",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  synchronize: true,
  logging: true,
  entities: [Product],
  subscribers: [],
  migrations: [],
});
