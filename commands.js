const fs = require('fs');

const prefix =  "!";

module.exports = async function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    console.log("[UPDATE]: NEW MESSAGE RECEIVED");
    console.log(`[CMD]: ${cmd}`);

    // commands added dynamically
    for (const file of commandFiles) {
        if (cmd == file.replace('.js', '')) {
            const command = require(`./commands/${file}`);
            command(message);
        }
    }
  
    if (cmd == "s2texit") {  // TEMP TO TEST
      message.channel.send(`\n\nShutting down Speech-to-Text Bot.`);
      console.log(`[EXIT]: Shutting down ${client.user.tag}..`);
      process.exit(0);
    }
}