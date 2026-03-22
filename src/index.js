/**
 * @fileoverview Main entry point for the Frodo Discord bot.
 * This file initializes the Discord client, loads commands and events,
 * and connects the bot to Discord.
 *
 * @requires dotenv - Loads environment variables from .env file
 * @requires colors - Adds color methods to console output
 * @requires discord.js - Discord API library
 */

require('dotenv').config({ quiet: true });
require('colors');

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before starting the bot.
 * Required variables:
 * - DISCORD_TOKEN: Bot authentication token from Discord Developer Portal
 * - ANTHROPIC_API_KEY: API key for Anthropic's Claude models
 * - CLIENT_ID: Discord application client ID for command registration
 */
const requiredEnvVars = ['DISCORD_TOKEN', 'ANTHROPIC_API_KEY', 'CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error(
		'[ERROR]'.red +
			` Missing required environment variables: ${missingEnvVars.join(', ')}`,
	);
	console.error('[ERROR]'.red + ' Please check your .env file.');
	process.exit(1);
}

/**
 * Discord Client Instance
 * Creates the bot client with required gateway intents:
 * - Guilds: Required for basic guild (server) functionality
 * - GuildPresences: Required for setting the bot's presence/status
 *
 * @type {Client}
 */
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

/**
 * Commands Collection
 * Stores all loaded slash commands, keyed by command name.
 * This collection is attached to the client for access in event handlers.
 *
 * @type {Collection<string, Object>}
 */
client.commands = new Collection();

/**
 * Command Loader
 * Dynamically loads all command files from the /commands directory.
 * Each command file must export an object with:
 * - data: SlashCommandBuilder instance defining the command
 * - execute: Async function that handles command execution
 */
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log('[COMMAND]'.green + ` Loaded: ${command.data.name}`);
	} else {
		console.log(
			'[WARNING]'.yellow +
				` Command at ${filePath} is missing "data" or "execute" property.`,
		);
	}
}

/**
 * Event Loader
 * Dynamically loads all event handler files from the /events directory.
 * Each event file must export an object with:
 * - name: Discord.js event name (e.g., Events.ClientReady)
 * - once: (optional) Boolean - if true, event fires only once
 * - execute: Function that handles the event
 */
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log('[EVENT]'.blue + ` Loaded: ${event.name}`);
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
