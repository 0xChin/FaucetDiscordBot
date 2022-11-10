# LW3 Faucet

This project was made for [LearnWeb3DAO](https://learnweb3.io) as a project for a bountie of EarnWeb3. It uses the [Kevin Novak's Typescript Discord Bot Template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template).

## Command Structure

The Discord bot accepts a command that looks like this:

`/faucet <network> <token>` and then disburse a predefined amount of funds (specific to that token on that network) to the ETH address associated with that person's Discord account.

## Demo

#### Sending funds (attach link to block explorer)

![Screen Shot 2022-11-07 at 03 42 11](https://user-images.githubusercontent.com/77933451/200242224-d01dd1f6-6428-465e-b593-d6baa68cd4a9.png)

#### Tokens not supported

![Screen Shot 2022-11-07 at 03 48 56](https://user-images.githubusercontent.com/77933451/200243346-30776d6e-7f04-4f70-8f09-93f4a48873f4.png)

#### Request in cooldown

![Screen Shot 2022-11-08 at 13 53 21](https://user-images.githubusercontent.com/77933451/200626826-0555b0cc-ab11-4d25-b3b8-052efa4109ca.png)

#### Insufficient funds

![Screen Shot 2022-11-07 at 03 45 57](https://user-images.githubusercontent.com/77933451/200242852-ae5367ae-8406-4efa-98c9-e375498a1737.png)

## Supported networks

Currently, the following networks are supported by default:

-   Ethereum Goerli (ETH & LINK)
-   Polygon Mumbai (MATIC & LINK)
-   Celo Alfajores (CELO)

Anyways, it is possible to add any token of any network (EVM) by using the following interface:

```typescript
interface Networks {
    [network: string]: {
        chainId: number;
        tokens: {
            [token: string]: {
                amount: number; // @notice that this amount is measured in ETH
                address?: string;
                isNativeToken?: boolean;
            };
        };
        blockExplorer: string;
    };
}
```

## Features

### Faucet:

-   People can request tokens via the `/faucet <network> <token>` command.
-   Embeds usage for better UI :).
-   Validations with warning/error messages.
-   Cooldown for requesting tokens

### Developer Friendly:

-   Written with TypeScript.
-   Uses the [discord.js](https://discord.js.org/) framework.
-   Built-in debugging setup for VSCode.
-   Written with [ESM](https://nodejs.org/api/esm.html#introduction) for future compatibility with packages.
-   Support for running with the [PM2](https://pm2.keymetrics.io/) process manger.
-   Support for running with [Docker](https://www.docker.com/).

## Setup

1. Copy example config files.
    - Navigate to the `config` folder of this project.
    - Copy all files ending in `.example.json` and remove the `.example` from the copied file names.
        - Ex: `config.example.json` should be copied and renamed as `config.json`.
2. Obtain a bot token.
    - You'll need to create a new bot in your [Discord Developer Portal](https://discord.com/developers/applications/).
        - See [here](https://www.writebots.com/discord-bot-token/) for detailed instructions.
        - At the end you should have a **bot token**.
3. Modify the config file.
    - Open the `config/config.json` file.
    - You'll need to edit the following values:
        - `client.id` - Your discord bot's [user ID](https://techswift.org/2020/04/22/how-to-find-your-user-id-on-discord/).
        - `client.token` - Your discord bot's token.
        - `privateKey` - The private key of the account that will be sending funds.
        - `networks.{network}.nodeUri` - The URI to the node providers.
        - `database` - All fields in this object are for the database connection. Note: You can create a local database by running `docker-compose up -d` thanks to the `docker-compose.yml` file
4. Install packages.
    - Navigate into the downloaded source files and type `npm install`.
5. Register commands.
    - In order to use slash commands, they first [have to be registered](https://discordjs.guide/interactions/slash-commands.html#registering-slash-commands).
    - Type `npm run commands:register` to register the bot's commands.
        - Run this script any time you change a command name, structure, or add/remove commands.
        - This is so Discord knows what your commands look like.
        - It may take up to an hour for command changes to appear.
6. Start the bot.
    - Run `npm start` and let the faucet send funds to your students :).

## Support

### Connecting to LW3 Backend:

To send the address based on the Discord ID, you will need to connect to your backend. I've created a function in [faucet-utils.ts](https://github.com/AlanRacciatti/lw3-faucet/blob/main/src/utils/faucet-utils.ts) that you'll have to complete and then the bot will be ready to go

```typescript
export class FaucetUtils {
    public static async getAddressFromId(id: string): Promise<string | null> {
        // TODO: Connect to LW3 backend plz

        return '0x6864dC5998c25Db320D3370A53592E44a246FFf4'; // chiin.eth :)
    }

    // More stuff here...
}
```

### Adding new tokens/networks

Supposing we have the following `networks` property in our `config.json`:

```json
"networks": {
        "GOERLI": {
            "chainId": 5,
            "tokens": {
                "ETH": {
                    "amount": 0.001,
                    "isNativeToken": true
                }
            },
            "blockExplorer": "https://goerli.etherscan.io/tx/",
            "nodeUri": "<node-uri>"
        },
```

##### Adding new tokens

We have to add a new property in the `tokens` object with the name of our token, and add a `amount` and `address` field. For example, for adding the LINK token, we should do it this way:

```json
"networks": {
        "GOERLI": {
            "chainId": 5,
            "tokens": {
                "ETH": {
                    "amount": 0.001,
                    "isNativeToken": true
                },
                "LINK": {
                    "amount": 0.1,
                    "address": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
                }
            },
            "blockExplorer": "https://goerli.etherscan.io/tx/",
            "nodeUri": "<node-uri>"
        },
```

After making this change, run `npm run update:faucet` to update the commands

##### Adding new networks

We have to add a new property in the `networks` object with the name of the network and add the fields: `chainId`, `blockExplorer` & `nodeUri`. For adding the mumbai network with the LINK token, we should do it this way:

```json
        "GOERLI": {
            "chainId": 5,
            "tokens": {
                "ETH": {
                    "amount": 0.001,
                    "isNativeToken": true
                },
                "LINK": {
                    "amount": 0.1,
                    "address": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
                }
            },
            "blockExplorer": "https://goerli.etherscan.io/tx/",
            "nodeUri": "<node-uri>"
        },
        "MUMBAI": {
            "chainId": 80001,
            "tokens": {
                "LINK": {
                    "amount": 0.1,
                    "address": "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
                }
            },
            "blockExplorer": "https://mumbai.polygonscan.com/tx/",
            "nodeUri": "<node-uri>"
        }
```

After making this change, run `npm run update:faucet` to update the commands
