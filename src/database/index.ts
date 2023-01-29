import { AppDataSource } from './data-source.js';
import { RequestCooldown } from './request-cooldown-entity.js';

export const InitializeDb = async (): Promise<void> => {
    try {
        await AppDataSource.initialize()
        console.log('[DB] Connected to the database')
    } catch (error) {
        console.log(error);
    }
}

export { AppDataSource, RequestCooldown };