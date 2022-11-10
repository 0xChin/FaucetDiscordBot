import { BigNumber, ethers } from 'ethers';
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EthersUtils, RequestCooldownUtils } from './index.js';

export interface Networks {
    [network: string]: {
        chainId: number,
        tokens: {
            [token: string]: {
                amount: number,
                address?: string,
                isNativeToken?: boolean
            }
        },
        blockExplorer: string,
        nodeUri: string
    }
}

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const networks: Networks = Config.networks;

export class FaucetUtils {
    public static async sendTokens(
        address: string,
        network: string,
        token: string,
    ): Promise<string> {
        let txHash: string;

        if (networks[network].tokens[token].isNativeToken) {
            txHash = await EthersUtils.sendNativeTokens(address, network, token);
        } else {
            txHash = await EthersUtils.sendTokens(address, network, token);
        }

        return `${networks[network].blockExplorer}${txHash}`
    }

    public static async hasBalance(
        network: string,
        token: string
    ): Promise<boolean> {
        const balance: BigNumber = await EthersUtils.getBalance(network, token);
        const balanceNeeded: BigNumber = ethers.utils.parseEther(networks[network].tokens[token].amount.toString());

        return balance.gte(balanceNeeded);
    }

    public static getAmount(
        network: string,
        token: string
    ): string {
        return networks[network].tokens[token].amount.toString();
    }

    public static async nextRequest(
        userId: string,
        network: string,
        token: string
    ): Promise<string | null> {
        const requestCooldown = await RequestCooldownUtils.get(userId, network, token);

        if (requestCooldown) {
            const nextRequest = requestCooldown.lastRequest.setTime(requestCooldown.lastRequest.getTime() + Config.requestCooldown * 60 * 60 * 1000);
            const currentTime = new Date().getTime();

            if (nextRequest <= currentTime) {
                return null;
            }

            let hoursLeft: string | number = Math.floor((nextRequest - currentTime) / 60 / 60 / 1000);
            let minutesLeft: string | number = Math.floor(((nextRequest - currentTime) / 60 / 1000) % 60);

            hoursLeft = hoursLeft.toString().length == 1 ? `0${hoursLeft}` : hoursLeft;
            minutesLeft = minutesLeft.toString().length == 1 ? `0${minutesLeft}` : minutesLeft;

            return `${hoursLeft}:${minutesLeft}hs`;
        } else {
            return null;
        }
    }

    public static updateRequestCooldown(
        userId: string,
        network: string,
        token: string
    ): void {
        RequestCooldownUtils.createOrUpdate(userId, network, token);
    }

    public static isTokenSupported(
        network: string,
        token: string
    ): boolean {
        return networks[network].tokens[token] ? true : false;
    }

    public static async updateFaucetOptions(): Promise<void> {
        const dataPath = '../../lang/lang.en-US.json';

        const data = require(dataPath);
        const dataRoute = join(__dirname, '../../lang/lang.en-US.json')

        const networks = Object.keys(Config.networks);
        let networksData = Object.values(Config.networks);
        let tokens = []

        networksData.forEach(networkData => {
            Object.keys(networkData['tokens']).forEach(token => {
                if (tokens.indexOf(token) === -1) {
                    tokens.push(token);
                }
            })
        })

        let newNetworkOptions = {};
        let newTokenOptions = {};

        networks.forEach(network => {
            newNetworkOptions[network.toLowerCase()] = network.toLowerCase();
        })

        tokens.forEach(token => {
            newTokenOptions[token.toLowerCase()] = token;
        })

        data.refs.faucetNetworkOptions = newNetworkOptions;
        data.refs.faucetTokenOptions = newTokenOptions;

        writeFileSync(dataRoute, JSON.stringify(data, null, 4));
    }
}