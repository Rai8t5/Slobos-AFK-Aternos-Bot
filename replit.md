# Running on Replit

## Project
This imported project is a Node.js Minecraft bot using Mineflayer, with an Express status dashboard. Keep the existing root-level structure and npm setup.

## Run
- Runtime: Node.js 22 (required by the installed Minecraft dependencies).
- Click **Run** to start the `Start application` workflow, which executes `npm start` (`node index.js`).
- The dashboard listens on `0.0.0.0:5000` and appears in Preview.
- `npm test` checks the syntax of the main entry point.
- `/health` returns live bot status; `/ping` returns `pong`.

## Configuration
- Edit `settings.json` to set the Minecraft server address, port, bot username, account type, and enabled modules.
- The imported configuration uses an offline account and automatic Minecraft-version detection. No new external service is required for that configuration.
- The bot is silent and idle: movement, anti-AFK actions, combat, automatic authentication/chat, replies, dashboard commands, and terminal chat commands are disabled. The server decides the bot's game mode; this app does not issue a game-mode command.
- A Minecraft status ping checks the server player count every 10 seconds. The bot only connects when the server is empty; if another player joins while it is connected, it disconnects and waits until everyone else leaves before reconnecting.
- A duplicate-login kick means another connection is using the same bot username. Stop that instance or use a distinct username before expecting a stable connection.
- Render-specific self-pinging remains disabled because `RENDER_EXTERNAL_URL` is not configured; it is not needed to start this workflow.
- Do not commit real passwords or webhook credentials. The imported application currently reads authentication settings from JSON; secret-backed configuration is a separate improvement.

## Safety and scope
- Starting the app automatically connects the bot and activates the enabled modules.
- The imported dashboard has unauthenticated bot-control and command endpoints. Do not expose it publicly without adding access protection.
- Running in the development workspace does not establish guaranteed 24/7 hosting.

## Verification
The dashboard rendered in Preview, `/health` and `/ping` responded, the syntax check passed, and the bot successfully spawned on the configured server. A subsequent duplicate-login kick was followed by a successful automatic reconnect.