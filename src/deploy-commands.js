/**
 * @fileoverview Slash Command Deployment Script
 * Registers all slash commands with Discord's API.
 * Run this script whenever you add, modify, or remove commands.
 *
 * Usage: npm run deploy
 *
 * Note: Global commands can take up to 1 hour to propagate.
 * For instant updates during development, use guild-specific commands instead.
 *
 * @requires dotenv - Environment variable loading
 * @requires discord.js - REST API client
 */

require('dotenv').config({ quiet: true });
require('colors');

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Commands Array
 * Collects all command definitions to be registered with Discord.
 * Each command is converted to JSON format for the API.
 * @type {Array<Object>}
 */
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(
			'[DEPLOY]'.cyan +
				` Started refreshing ${commands.length} application (/) commands.`,
		);

		// Deploy commands globally
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(
			'[DEPLOY]'.green +
				` Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		console.error('[ERROR]'.red, error);
	}
})();
