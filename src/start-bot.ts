import { REST } from '@discordjs/rest';
import { Options, Partials } from 'discord.js';
import { createRequire } from 'node:module';

import { FaucetCommand } from './commands/chat/index.js';
import {
    ChatCommandMetadata,
    Command
} from './commands/index.js';
import { CustomClient } from './extensions/index.js';
import { Bot } from './models/bot.js';
import {
    EventDataService,
    Logger,
    CommandRegistrationService
} from './services/index.js';
import { InitializeDb } from './database/index.js';
import { CommandHandler } from './events/command-handler.js';

const require = createRequire(import.meta.url);
let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    // Services
    let eventDataService = new EventDataService();

    // Client
    let client = new CustomClient({
        intents: Config.client.intents,
        partials: (Config.client.partials as string[]).map(partial => Partials[partial]),
        makeCache: Options.cacheWithLimits({
            // Keep default caching behavior
            ...Options.DefaultMakeCacheSettings,
            // Override specific options from config
            ...Config.client.caches,
        }),
    });

    // Commands
    let commands: Command[] = [
        new FaucetCommand(),
    ];

    // Event handlers
    let commandHandler = new CommandHandler(commands, eventDataService);

    // Database
    InitializeDb();

    // Bot
    let bot = new Bot(
        Config.client.token,
        client,
        commandHandler,
    );

    // Register
    if (process.argv[2] == 'commands') {
        try {
            let rest = new REST({ version: '10' }).setToken(Config.client.token);
            let commandRegistrationService = new CommandRegistrationService(rest);
            let localCmds = [
                ...Object.values(ChatCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
            ];
            await commandRegistrationService.process(localCmds, process.argv);
        } catch (error) {
            Logger.error(Logs.error.commandAction, error);
        }
        process.exit();
    }

    await bot.start();
}

process.on('unhandledRejection', (reason, _promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
