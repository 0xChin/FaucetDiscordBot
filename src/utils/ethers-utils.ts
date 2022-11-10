import { createRequire } from 'node:module';
import { BigNumber, Contract, ethers, providers, Wallet } from 'ethers';
import { CeloProvider, CeloWallet } from '@celo-tools/celo-ethers-wrapper';
import { Networks } from './faucet-utils.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let abi = require('erc-20-abi');

const networks: Networks = Config.networks;
const privateKey = Config.privateKey;

export class EthersUtils {
    private static async getSigner(network): Promise<Wallet> {
        let signer: Wallet;

        if (network === "ALFAJORES") { // Celo needs a specific provider, it sucks right?
            const provider = new CeloProvider(networks[network].nodeUri);
            await provider.ready;
            signer = new CeloWallet(privateKey, provider);

        } else {
            const provider: providers.StaticJsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(networks[network].nodeUri, networks[network].chainId);
            signer = new ethers.Wallet(privateKey, provider);
        }

        return signer;
    }

    private static async getContract(signer: Wallet, address: string): Promise<Contract> {
        return new ethers.Contract(address, abi, signer);
    }

    public static async getBalance(
        network: string,
        token: string
    ): Promise<BigNumber> {
        const signer: Wallet = await this.getSigner(network);

        if (networks[network].tokens[token].isNativeToken) {
            return await signer.provider.getBalance(signer.address);
        } else {
            const contract: Contract = await this.getContract(signer, networks[network].tokens[token].address);
            return contract.balanceOf(signer.address);
        }
    }

    public static async sendNativeTokens(
        address: string,
        network: string,
        token: string
    ): Promise<string> {
        const signer: Wallet = await this.getSigner(network);

        const tx: providers.TransactionResponse = await signer.sendTransaction({
            to: address,
            value: ethers.utils.parseEther(networks[network].tokens[token].amount.toString())
        })

        return tx.hash;
    }

    public static async sendTokens(
        address: string,
        network: string,
        token: string
    ): Promise<string> {
        const signer: Wallet = await this.getSigner(network);
        const contract: Contract = await this.getContract(signer, networks[network].tokens[token].address);

        const tx: providers.TransactionResponse = await contract.transfer(address, ethers.utils.parseEther(networks[network].tokens[token].amount.toString()))

        return tx.hash;
    }
}