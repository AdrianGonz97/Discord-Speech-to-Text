require('custom-env').env('staging');
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix =  "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  console.log("[UPDATE] NEW MESSAGE RECEIVED!!");
  console.log(`[CMD]: ${message.content.slice(prefix.length).split(/ +/)}`);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "s2texit") {  // TEMP TO TEST BABY
    message.channel.send(`\n\nShutting down Speech-to-Text Bot.`);
    console.log(`[UPDATE] Shutting down ${client.user.tag}..`);
    process.exit(0);
  }

  if (command == "transcribe") {
    transcribe(message);
  }
});

async function transcribe(message) {
  const voiceChannel = message.member.voice.channel;
  //const user = message.author;
  //console.log(user.id);
  //console.log(voiceChannel);

  if (voiceChannel) {
    console.log(`[UPDATE] Joining voice channel ${voiceChannel.id} on guild ${voiceChannel.guild.id}`);
    console.log(voiceChannel.members);

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }
  }
  else {
    console.log("[UPDATE] User is not in a voice channel")
    return message.channel.send("You must be in a voice channel to begin transcribing!");
  } 

  try { // joins the channel
    let connection = await voiceChannel.join();

    connection.on('disconnect', () => {
      message.channel.send("Disconnected voice channel as there are no users present.");
      console.log(`[UPDATE] Bot disconnected from channel ${connection.channel.id} on guild ${connection.channel.guild.id}`);
    });

    connection.on('speaking', (user, speaking) => {
      // emitted whenever a user changes speaking state
      //let receiver = connection.receiver;
      //console.log(user);
      //console.log(speaking);

      if (speaking.bitfield === 1) {
        console.log(`[UPDATE] User ${user.id} is speaking!`);
      }
      else {
        console.log(`[UPDATE] User ${user.id} has stopped speaking!`);
      }
    });
  }
  catch (err){
    console.log(`[ERROR] ${err}`);
    return message.channel.send(err);
  }
}

client.login(process.env.BOT_TOKEN);