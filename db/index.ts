import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth } from './entities/index';

const type: any = process.env.DATABASE_TYPE;
const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

const AppDataSource = new DataSource({
  type,
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
