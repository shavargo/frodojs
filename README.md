# Frodo - Discord Bot 🧝

A Discord bot that lets you chat with Frodo Baggins, powered by Anthropic Claude.

## Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_client_id
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

3. Deploy slash commands and start the bot:
   ```bash
   npm run deploy
   npm start
   ```

## Commands

| Command           | Description             |
| ----------------- | ----------------------- |
| `/chat <message>` | Chat with Frodo Baggins |
| `/ping`           | Check bot latency       |

## Scripts

| Script            | Description               |
| ----------------- | ------------------------- |
| `npm start`       | Start the bot             |
| `npm run deploy`  | Deploy slash commands     |
| `npm run lint`    | Run ESLint                |
| `npm run format`  | Format code with Prettier |

## Deployment

### Docker

```bash
# Build image
docker build -t frodojs .

# Run container
docker run -d \
  -e DISCORD_TOKEN=your_token \
  -e CLIENT_ID=your_client_id \
  -e ANTHROPIC_API_KEY=your_api_key \
  frodojs
```

### Railway

1. Add environment variables in Railway dashboard:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `ANTHROPIC_API_KEY`

2. Railway will automatically use `railpack.json` for build configuration
