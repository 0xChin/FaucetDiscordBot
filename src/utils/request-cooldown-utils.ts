import { AppDataSource, RequestCooldown } from "../database/index.js";

export class RequestCooldownUtils {
    public static async get(
        address: string,
        network: string,
        token: string
    ): Promise<RequestCooldown | null> {
        const result = await RequestCooldown.findOneBy({
            address,
            network,
            token
        })

        return result ?? null;
    }

    public static async createOrUpdate(
        address: string,
        network: string,
        token: string
    ) {
        let request: RequestCooldown
        request = await this.get(address, network, token);

        if (request) {
            request.lastRequest = new Date();
        } else {
            request = new RequestCooldown();
            request.lastRequest = new Date();
            request.network = network;
            request.token = token;
            request.address = address;
        }

        await AppDataSource.manager.save(request);
    }
}