const express = require("express");
const mineflayer = require("mineflayer");

const app = express();
const PORT = process.env.PORT || 3000;

// Cap log buffer at 10 to keep memory consumption minimal
const logs = [];
function addLog(msg) {
  const time = new Date().toLocaleTimeString();
  const entry = `[${time}] ${msg}`;
  console.log(entry);
  logs.push(entry);
  if (logs.length > 10) logs.shift();
}

let bot = null;
let runInterval = null;

function cleanup() {
  if (runInterval) {
    clearInterval(runInterval);
    runInterval = null;
  }
}

function createBot() {
  // Clean up any existing intervals before reconnecting
  cleanup();

  addLog("[System] Initializing low-memory bot instance...");

  bot = mineflayer.createBot({
    host: "YOUR_SERVER_IP", // Change to your server IP
    port: 25565,
    username: "SINNER",
    physicsEnabled: false,   // Disables physics engine (saves massive RAM)
    viewDistance: "tiny"     // Requests minimal chunk data from server
  });

  bot.on("spawn", () => {
    addLog("[Bot] SINNER connected.");
    
    cleanup();

    // Sends "RUN" every 2 hours (7,200,000 ms)
    runInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.chat("RUN");
        addLog('[Bot] Said "RUN" in chat.');
      }
    }, 7200000);
  });

  bot.on("end", (reason) => {
    cleanup();
    addLog(`[Bot] Disconnected (${reason}). Reconnecting in 15s...`);
    setTimeout(createBot, 15000);
  });

  bot.on("error", (err) => addLog(`[Error] ${err.message}`));
  bot.on("kicked", (reason) => addLog(`[Kicked] ${reason}`));
}

// Lightweight HTML Dashboard
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SINNER Bot</title>
      <meta http-equiv="refresh" content="10">
      <style>
        body { background: #0d1117; color: #c9d1d9; font-family: monospace; padding: 20px; }
        .container { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; }
        h1 { color: #ff4444; margin-top: 0; }
        .online { color: #2ea043; font-weight: bold; }
        .offline { color: #f85149; font-weight: bold; }
        .logs { background: #000; padding: 10px; border-radius: 4px; color: #00ff66; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SINNER TERMINAL</h1>
        <div>Status: <span class="${bot && bot.entity ? 'online' : 'offline'}">${bot && bot.entity ? 'ONLINE' : 'OFFLINE'}</span></div>
        <div class="logs">
          ${logs.map(log => `<div>${log}</div>`).join("")}
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  addLog(`[Web] Dashboard running on port ${PORT}`);
  createBot();
});

// Process Guards to Prevent Fatal Crashes
process.on("uncaughtException", (err) => console.log(`[Prevented Crash] ${err.message}`));
process.on("unhandledRejection", (err) => console.log(`[Prevented Rejection] ${err}`));
