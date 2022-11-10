import {
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';
import { Args } from './index.js';

export const ChatCommandMetadata: {
    [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
    FAUCET: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('chatCommands.faucet', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('chatCommands.faucet'),
        description: Lang.getRef('commandDescs.faucet', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commandDescs.faucet'),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Args.FAUCET_NETWORK_OPTION,
                required: true
            },
            {
                ...Args.FAUCET_TOKEN_OPTION,
                required: true
            },
            {
                ...Args.ADDRESS_OPTION,
                required: true
            }
        ]
    },
};