import { Sequelize } from "sequelize";
import config from "../config";

let sequelize: Sequelize;

const checkDbExistsQuery = () => {
  return `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${config.db.database}'`;
};

const createDbQuery = () => {
  return `CREATE DATABASE ${config.db.database}`;
};

export const initializeDatabase = (dbConfig: any) => {
  try {
    sequelize = new Sequelize(dbConfig);
  } catch (error) {
    console.log("Error initializing DB: ", error);
  }
};

export const execQuery = (query: string, options: any) => {
  return sequelize.query(query, {
    bind: options,
    nest: true,
  });
};

export const execQuerySingle = (query: string, options: any) => {
  return sequelize.query(query, {
    bind: options,
    nest: true,
    plain: true,
  });
};

export const createDatabase = async () => {
  try {
    const result = await execQuerySingle(checkDbExistsQuery(), {});

    if (result) {
      console.log("Skipping creation. DB already exists.");
    } else {
      await execQuery(createDbQuery(), {});
    }

    initializeDatabase(config.db);
  } catch (error: any) {
    if (
      error.name === "SequelizeDatabaseError" &&
      error.parent &&
      error.parent.code === "42P04"
    ) {
      console.log("Skipping creation. DB already exists.");
    } else {
      console.log("Error creating DB: ", error);
    }
  }
};
