/**
 * @fileoverview AI Configuration and Response Generation
 * Handles all Anthropic Claude API interactions for the Frodo chatbot.
 * Configuration is centralized here for easy modification.
 *
 * @requires @anthropic-ai/sdk - Anthropic Node.js SDK
 * @see prompt.txt - Contains Frodo's personality and knowledge base
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

/**
 * Anthropic Client Instance
 * Initialized with API key from environment variables.
 * @type {Anthropic}
 */
const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * AI Model Configuration
 * @constant {string} MODEL - The Claude model to use for responses
 *                           claude-haiku-4-5-20251001: Fast, cost-effective, good quality
 *                           claude-sonnet-4-6: Higher quality, more expensive
 */
const MODEL = 'claude-haiku-4-5-20251001';

/**
 * Maximum Response Length
 * @constant {number} MAX_TOKENS - Limits response length (1 token ≈ 4 characters)
 *                                 2000 tokens ≈ 1500 words maximum
 */
const MAX_TOKENS = 2000;

/**
 * System Prompt
 * Loaded from prompt.txt - defines Frodo's personality, knowledge, and behavior.
 * Edit prompt.txt to modify how Frodo responds without changing code.
 * @constant {string}
 */
const SYSTEM_PROMPT = fs.readFileSync(
	path.join(__dirname, 'prompt.txt'),
	'utf-8',
);

/**
 * Generate a response from Frodo
 * @param {string} userMessage - The user's message to Frodo
 * @returns {Promise<string>} - Frodo's response
 */
async function generateResponse(userMessage) {
	const response = await anthropic.messages.create({
		model: MODEL,
		max_tokens: MAX_TOKENS,
		system: SYSTEM_PROMPT,
		messages: [
			{
				role: 'user',
				content: userMessage,
			},
		],
	});

	return response.content[0].text;
}

module.exports = {
	generateResponse,
	MODEL,
	MAX_TOKENS,
	SYSTEM_PROMPT,
};
