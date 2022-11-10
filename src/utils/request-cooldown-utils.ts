import { AppDataSource, RequestCooldown } from "../database/index.js";

export class RequestCooldownUtils {
    public static async get(
        userId: string,
        network: string,
        token: string
    ): Promise<RequestCooldown | null> {
        const result = await RequestCooldown.findOneBy({
            userId,
            network,
            token
        })

        return result ?? null;
    }

    public static async createOrUpdate(
        userId: string,
        network: string,
        token: string
    ) {
        let request: RequestCooldown
        request = await this.get(userId, network, token);

        if (request) {
            request.lastRequest = new Date();
        } else {
            request = new RequestCooldown();
            request.lastRequest = new Date();
            request.network = network;
            request.token = token;
            request.userId = userId;
        }

        await AppDataSource.manager.save(request);
    }
}