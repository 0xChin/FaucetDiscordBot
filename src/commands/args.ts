import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

const networks = Object.keys(Config.networks);
let networksData = Object.values(Config.networks);
let tokens = []

networksData.forEach(network => {
    Object.keys(network['tokens']).forEach(token => {
        if (tokens.indexOf(token) === -1) {
            tokens.push(token);
        }
    })
});

export class Args {
    public static readonly FAUCET_NETWORK_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.network', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.network'),
        description: Lang.getRef('argDescs.network', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.network'),
        type: ApplicationCommandOptionType.String,
        choices: networks.map(network => {
            return {
                name: Lang.getRef(`faucetNetworkOptions.${network.toLowerCase()}`, Language.Default),
                name_localizations: Lang.getRefLocalizationMap(`faucetNetworkOptions.${network.toLowerCase()}`),
                value: network,
            }
        })
    };
    public static readonly FAUCET_TOKEN_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.token', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.token'),
        description: Lang.getRef('argDescs.token', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.token'),
        type: ApplicationCommandOptionType.String,
        choices: tokens.map(token => {
            return {
                name: Lang.getRef(`faucetTokenOptions.${token.toLowerCase()}`, Language.Default),
                name_localizations: Lang.getRefLocalizationMap(`faucetTokenOptions.${token.toLowerCase()}`),
                value: token,
            }
        })
    };
    public static readonly ADDRESS_OPTION: APIApplicationCommandBasicOption = {
        name: Lang.getRef('arguments.address', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('arguments.address'),
        description: Lang.getRef('argDescs.address', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('argDescs.address'),
        type: ApplicationCommandOptionType.String,
    }
}