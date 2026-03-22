/**
 * @fileoverview Client Ready Event Handler
 * This event fires once when the bot successfully connects to Discord
 * and is ready to receive events. Sets the bot's presence/status.
 *
 * @event ClientReady
 */

require('colors');

const { Events, ActivityType } = require('discord.js');

module.exports = {
	/**
	 * Event name - fires when bot is connected and ready
	 * @type {string}
	 */
	name: Events.ClientReady,

	/**
	 * Run only once - prevents re-execution on reconnects
	 * @type {boolean}
	 */
	once: true,

	/**
	 * Initializes the bot after successful Discord connection.
	 * Logs the bot's username and sets its presence/activity status.
	 *
	 * @param {Client} client - The Discord client instance
	 */
	execute(client) {
		console.log('[READY]'.green + ` Logged in as ${client.user.tag}!`);

		// Set bot status
		client.user.setPresence({
			activities: [
				{
					name: 'tales from the Shire',
					type: ActivityType.Listening,
				},
			],
			status: 'online',
		});
	},
};
