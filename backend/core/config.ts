import path from "path";
import * as dotenv from "dotenv";

dotenv.config({
  path: path.normalize(`.env`),
});

const ENVIRONMENT = {
  port: process.env.PORT || 5000,
  db: {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION || `postgres`,
    synchronize: true,
    entities: [],
    subscribers: [],
    migrations: [],
    seederStorage: `sequelize`,
    dialectOptions: {
      charset: `utf8mb4`,
    },
    logging: (str: any) => {
      if (process.env.DB_LOGGING) {
        console.log(str);
      }
    },
  },
};

export default ENVIRONMENT;
