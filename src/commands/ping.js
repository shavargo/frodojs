/**
 * @fileoverview Ping Command - Check Bot Latency
 * A utility command to test if the bot is responsive and measure latency.
 * Displays both roundtrip latency and WebSocket heartbeat latency.
 *
 * Usage: /ping
 *
 * Latency Types:
 * - Roundtrip: Time from command sent to response received
 * - WebSocket: Discord gateway connection latency (heartbeat)
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	/**
	 * Slash Command Definition
	 * Defines the /ping command with no options.
	 */
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot latency'),

	async execute(interaction) {
		const sent = await interaction.reply({
			content: 'Fetching latency...',
			fetchReply: true,
		});

		const roundtripLatency =
			sent.createdTimestamp - interaction.createdTimestamp;
		const wsLatency = interaction.client.ws.ping;

		const embed = new EmbedBuilder()
			.setColor(0x5865f2)
			.setTitle('Latency Results')
			.addFields(
				{
					name: 'Roundtrip Latency',
					value: `${roundtripLatency}ms`,
					inline: true,
				},
				{ name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true },
			)
			.setTimestamp();

		await interaction.editReply({ content: null, embeds: [embed] });
	},
};
