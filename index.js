require('custom-env').env();
const commandHandler = require('./commands');
const Discord = require('discord.js');
const makeDir = require('./helpers/make-dir');
const path = require('path');

const client = new Discord.Client();

const audioFolder = path.join(process.env.AUDIO_SAVE_PATH, 'audio_files');

console.log(`[SETTINGS]: Audio Logging: ${process.env.AUDIO_LOGGING == 'true'}`);
console.log(`[SETTINGS]: Saving Audio Files To: ${audioFolder}`);
console.log(`[SETTINGS]: Language Code: ${process.env.LANGUAGE_CODE}`);

makeDir(audioFolder);

client.on('ready', () => {
  console.log(`[START]: Logged in as ${client.user.tag}!`);
});

client.once("disconnect", () => {
  console.log("[EXIT]: Disconnecting");
});

client.on('message', commandHandler);

client.login(process.env.BOT_TOKEN);