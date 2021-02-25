require('custom-env').env('staging');
const speech = require('@google-cloud/speech');
const Discord = require('discord.js');
const fs = require('fs');
const { disconnect } = require('process');
const ts = require('./transcriber');

const sclient = new speech.SpeechClient();
const client = new Discord.Client();
const prefix =  "!";

//const filename = '133737373677780993_1614116531717';
const encoding = 'LINEAR16';
const sampleRateHertz = 48000;
const languageCode = process.env.LANGUAGE_CODE;//'en-US';
const audioFolder = '../audio_files'
const saveFiles = (process.env.AUDIO_LOGGING == 'true');

console.log(`[SETTINGS]: Audio Logging: ${saveFiles}`);
console.log(`[SETTINGS]: Language Code: ${process.env.LANGUAGE_CODE}`);

makeDir(audioFolder);

client.on('ready', () => {
  console.log(`[START]: Logged in as ${client.user.tag}!`);
});

client.once("disconnect", () => {
  console.log("[EXIT]: Disconnecting");
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  console.log("[UPDATE]: NEW MESSAGE RECEIVED");
  console.log(`[CMD]: ${message.content.slice(prefix.length).split(/ +/)}`);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == "s2texit") {  // TEMP TO TEST BABY
    message.channel.send(`\n\nShutting down Speech-to-Text Bot.`);
    console.log(`[EXIT]: Shutting down ${client.user.tag}..`);
    process.exit(0);
  }

  if (command == "transcribe") {
    transcribe(message);
  }

  if (command == "disconnect") {
    disconnectBot(message);
  }
});

async function transcribe(message) {
  const voiceChannel = message.member.voice.channel;

  if (voiceChannel) {
    let isAlreadyInChannel = false;
    client.voice.connections.each((connection) => {
      if (connection.channel.id == voiceChannel.id) {
        isAlreadyInChannel = true;
      }
    });
    
    if(isAlreadyInChannel) {
      return message.channel.send("Already transcribing in this channel!");
    }

    console.log(`[UPDATE]: Joining voice channel ${voiceChannel.id} on guild ${voiceChannel.guild.id}`);
    message.channel.send("Beginning transcription.\nTo disconnect bot, say \"disconnect\", or type command:\n\`\`\`!disconnect\`\`\`");
    //console.log(voiceChannel.members);

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }
  }
  else {
    console.log("[UPDATE]: User is not in a voice channel")
    return message.channel.send("You must be in a voice channel to begin transcribing!");
  } 

  try { // joins the channel
    let connection = await voiceChannel.join();
    connection.setSpeaking(0);
    
    // make dir based on server and channel
    const guildFolder = `${audioFolder}/Guild_${connection.channel.guild.id}`;
    const channelFolder = `${guildFolder}/Channel_${connection.channel.id}`;
    makeDir(guildFolder);
    makeDir(channelFolder);

    connection.on('disconnect', () => {
      message.channel.send("Disconnected from voice channel.");
      console.log(`[UPDATE]: Bot disconnected from channel ${connection.channel.id} on guild ${connection.channel.guild.id}`);
    });

    connection.on('speaking', (user, speaking) => { // emitted whenever a user changes speaking state
      let filename = saveFiles ? `${channelFolder}/${user.id}_${new Date().getTime()}`: `${channelFolder}/${user.id}`; //_${new Date().getTime()}
      let nickname = message.guild.member(user).nickname;
      if (!nickname) { // user speaking will be called by their nickname if present
        nickname = user.username;
      }

      if (speaking.bitfield === 1) {
        const request = {
          config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
            enableAutomaticPunctuation: true,
            speechContexts: [{
              phrases: ["Henil", "Shawn", "Arneal"]
            }],
          },
          interimResults: false, // If you want interim results, set this to true
        };
      
        // Stream the audio to the Google Cloud Speech API
        const recognizeStream = 
          sclient.streamingRecognize(request)
          .on('error', console.error)
          .on('data', data => {
              let transcript = data.results[0].alternatives[0].transcript;
              console.log("[UPDATE]: Finished transcribing")
              console.log(`[TRANSCRIPTION]: ${transcript}`);
              message.channel.send(`**${nickname}**: ${transcript}`);

              if(transcript.toLowerCase() == "disconnect")
                connection.disconnect();
          }
        );

        console.log(`[UPDATE]: User ${user.id} is speaking!`);   
        
        // start recording stream
        const audio = connection.receiver.createStream(user, { mode: 'pcm', end: 'silence' });
        let file = fs.createWriteStream(filename);
        
        audio.pipe(file);

        file.on('finish', () => {
          console.log(`[UPDATE]: Audio file saved: ${filename}`); 
          let f = fs.createReadStream(filename);
          f.pipe(recognizeStream);
          f.on('close', () => { 
            //console.log("CLOSED readstream");
          });
        });
      }
      else if (speaking.bitfield === 0) {
        console.log(`[UPDATE]: User ${user.id} has stopped speaking!`);
      }
    });
  }
  catch (err){
    console.log(`[ERROR]: ${err}`);
    return message.channel.send(err);
  }
}

async function disconnectBot(message) {
  const voiceChannel = message.member.voice.channel;

  if (voiceChannel) {
    let isAlreadyInChannel = false;
    client.voice.connections.each((connection) => {
      if (connection.channel.id == voiceChannel.id) {
        isAlreadyInChannel = true;
      }
    });
  }
}

function makeDir(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
      console.log(`[UPDATE]: Folder created: ${folderName}`);
    }
  } catch (err) {
    console.error(err)
  }
}

client.login(process.env.BOT_TOKEN);