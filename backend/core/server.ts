import express from "express";

import config from "./config";
import { initializeDatabase, createDatabase } from "./db/index";

const app = express();

const loadRoutes = () => {};

export const initializeServer = async () => {
  loadRoutes();

  const dbConfig = Object.assign({}, config.db);
  dbConfig.database = undefined;
  await initializeDatabase(dbConfig);
  await createDatabase();

  app.listen(config.port, () => {
    console.log(`Server started at port ${config.port}`);
  });
};
