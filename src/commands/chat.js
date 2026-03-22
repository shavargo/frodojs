/**
 * @fileoverview Chat Command - Talk with Frodo Baggins
 * The main command for interacting with the AI-powered Frodo character.
 * Includes rate limiting to prevent API abuse and input validation.
 *
 * Usage: /chat message:"Your question here"
 *
 * @requires discord.js - For slash command building and embeds
 * @requires ../config/ai - AI response generation
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateResponse } = require('../config/ai');

/**
 * Rate Limiting System
 * Prevents users from spamming the command and consuming API credits.
 * Uses a Map to track when each user can next use the command.
 * Maps user IDs to cooldown expiration timestamps.
 *
 * @type {Map<string, number>}
 */
const cooldowns = new Map();

/**
 * Cooldown Duration
 * Seconds users must wait between commands.
 *
 * @constant {number}
 */
const COOLDOWN_SECONDS = 30;

/**
 * Input Validation
 * Maximum characters allowed in user message.
 * Prevents excessive API token usage.
 *
 * @constant {number}
 */
const MAX_MESSAGE_LENGTH = 500;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chat')
		.setDescription('Chat with Frodo Baggins')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('Your message to Frodo')
				.setRequired(true)
				.setMaxLength(MAX_MESSAGE_LENGTH),
		),

	async execute(interaction) {
		const userId = interaction.user.id;

		// Check rate limit
		if (cooldowns.has(userId)) {
			const expirationTime = cooldowns.get(userId);
			const now = Date.now();

			if (now < expirationTime) {
				const remainingSeconds = Math.ceil((expirationTime - now) / 1000);
				return interaction.reply({
					content: `⏳ Please wait ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} before chatting with Frodo again.`,
					ephemeral: true,
				});
			}
		}

		// Set cooldown
		cooldowns.set(userId, Date.now() + COOLDOWN_SECONDS * 1000);

		// Auto-cleanup cooldowns after expiration
		setTimeout(() => cooldowns.delete(userId), COOLDOWN_SECONDS * 1000);

		const message = interaction.options.getString('message');

		// Validate message length (backup check)
		if (message.length > MAX_MESSAGE_LENGTH) {
			return interaction.reply({
				content: `Your message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
				ephemeral: true,
			});
		}

		// Defer the reply since Frodo's responses can take time
		await interaction.deferReply();

		try {
			const frodoResponse = await generateResponse(message);

			// Create an embed for the response
			const embed = new EmbedBuilder()
				.setColor(0x5865f2)
				.setAuthor({
					name: `${interaction.user.displayName}`,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setDescription(
					`> ${message}\n\n${frodoResponse.length > 3900 ? frodoResponse.substring(0, 3897) + '...' : frodoResponse}`,
				)
				.setFooter({ text: 'Frodo Baggins of the Shire' })
				.setTimestamp();

			// If response is too long for embed, send as regular message
			if (frodoResponse.length > 3900) {
				// Truncate to Discord's 2000 char limit
				const maxContentLength = 2000;
				let content = `${interaction.user}\n> ${message}\n\n${frodoResponse}`;

				if (content.length > maxContentLength) {
					content = content.substring(0, maxContentLength - 3) + '...';
				}

				await interaction.editReply({ content });
			} else {
				await interaction.editReply({
					content: `${interaction.user}`,
					embeds: [embed],
				});
			}
		} catch (error) {
			// Sanitized logging - only log error code and message, not full object
			console.error(
				'[AI ERROR]'.red,
				`Status: ${error.status || 'unknown'}, Message: ${error.message || 'No message'}`,
			);

			let errorMessage =
				'Failed to get a response from Frodo. Please try again later.';
			if (error.status === 429) {
				errorMessage = 'Frodo is resting. Please try again later.';
			} else if (error.status === 401) {
				errorMessage = 'Frodo cannot be reached right now.';
			}

			await interaction.editReply({ content: errorMessage });
		}
	},
};
