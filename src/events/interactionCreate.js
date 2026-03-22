/**
 * @fileoverview Interaction Create Event Handler
 * This event fires whenever a user interacts with the bot (slash commands,
 * buttons, select menus, modals, etc.). Currently handles slash commands only.
 *
 * @event InteractionCreate
 */

require('colors');

const { Events } = require('discord.js');

module.exports = {
	/**
	 * Event name - fires on any interaction (commands, buttons, etc.)
	 * @type {string}
	 */
	name: Events.InteractionCreate,

	/**
	 * Handles incoming interactions from Discord.
	 * Routes slash commands to their respective handlers and manages errors.
	 *
	 * @param {Interaction} interaction - The Discord interaction object
	 * @returns {Promise<void>}
	 */
	async execute(interaction) {
		// Only process slash (chat input) commands; ignore buttons, modals, etc.
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(
					'[ERROR]'.red +
						` No command matching ${interaction.commandName} was found.`,
				);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(
					'[ERROR]'.red +
						` Error executing ${interaction.commandName}: ${error.message}`,
				);

				const errorMessage = {
					content: 'There was an error while executing this command!',
					ephemeral: true,
				};

				try {
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp(errorMessage);
					} else {
						await interaction.reply(errorMessage);
					}
				} catch (replyError) {
					console.error(
						'[ERROR]'.red +
							` Failed to send error message: ${replyError.message}`,
					);
				}
			}
		}
	},
};
