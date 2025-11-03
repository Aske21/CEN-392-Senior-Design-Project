import path from "path";
import * as dotenv from "dotenv";

dotenv.config({
  path: path.normalize(`.env`),
});

const ENVIRONMENT = {
  port: process.env.PORT || 5000,
  db: {
    database: process.env.RDS_DB_NAME || process.env.DB_DATABASE,
    username: process.env.RDS_USERNAME || process.env.DB_USERNAME,
    password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
    host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
    port: process.env.RDS_PORT || process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION || `postgres`,
    ssl: process.env.DB_SSL
      ? {
          rejectUnauthorized: false,
        }
      : false,
    synchronize: true,
    entities: [],
    subscribers: [],
    migrations: [],
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
