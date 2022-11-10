import { DataSource } from "typeorm";
import { createRequire } from 'node:module';
import { RequestCooldown } from "./request-cooldown-entity.js";
import "reflect-metadata";

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.database.host,
    port: Config.database.port,
    username: Config.database.username,
    password: Config.database.password,
    database: Config.database.database,
    synchronize: true,
    logging: false,
    entities: [RequestCooldown],
    subscribers: [],
    migrations: [],
})