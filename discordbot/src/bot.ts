import { CacheType, Client, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config();

import * as tracks from './commands/track';


const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: "ut",
        description: "Top user tracks"
    },
    {
        name: "gt",
        description: "Global stats for given track"
    }
];

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
        return;
    }

    await (async (): Promise<any> => {
        return new Promise((resolve) => {
            switch (commandName) {
                case 'gt': {
                    resolve(tracks.handleTrackStatsGlobal(interaction))
                }
                case 'ut': {
                    resolve(tracks.handleTopUserTracks(interaction))
                }
            }
        });
    })();
});

client.login(DISCORD_BOT_TOKEN);