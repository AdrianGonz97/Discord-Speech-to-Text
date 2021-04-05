require('custom-env').env();
const fs = require('fs');
const makeDir = require('../helpers/make-dir');
const path = require('path');
const speech = require('@google-cloud/speech');

const speechClient = new speech.SpeechClient();

module.exports = async function (message) {
    const client = message.client;
    const voiceChannel = message.member.voice.channel;
    const summonerId = message.member.id;

    const encoding = 'LINEAR16';
    const sampleRateHertz = 48000;
    const languageCode = process.env.LANGUAGE_CODE;
    const saveFiles = (process.env.AUDIO_LOGGING == 'true');
    
    if (voiceChannel) {
        let isAlreadyInChannel = false;

        // check if bot is already connected to the VC
        client.voice.connections.each((connection) => { 
            if (connection.channel.id == voiceChannel.id) {
                isAlreadyInChannel = true;
            }
        });

        if (isAlreadyInChannel) { // if so, cancel request
            console.log("[UPDATE]: Bot is already transcribing in channel");
            return message.channel.send("Already transcribing in this channel!");
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // check for perms
            console.log("[UPDATE]: Does not have permissions to join and speak in voice channel");
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        console.log(`[UPDATE]: Joining voice channel ${voiceChannel.id} on guild ${voiceChannel.guild.id}`);
        message.channel.send("Beginning transcription.\nTo disconnect bot, say \"disconnect\", or type command:\n\`\`\`!disconnect\`\`\`");
    }
    else {
        console.log("[UPDATE]: User is not in a voice channel")
        return message.channel.send("You must be in a voice channel to begin transcribing!");
    }

    try { // joins the channel
        const connection = await voiceChannel.join();
        connection.setSpeaking(0);

        // make dir based on guild and channel
        const audioFolder = path.join(process.env.AUDIO_SAVE_PATH, 'audio_files');
        const guildFolder = path.join(audioFolder, `Guild_${connection.channel.guild.id}`);
        const channelFolder = path.join(guildFolder, `Channel_${connection.channel.id}`);
        makeDir(guildFolder);
        makeDir(channelFolder);

        connection.on('disconnect', () => {
            message.channel.send("Disconnected from voice channel.");
            console.log(`[UPDATE]: Bot disconnected from channel ${connection.channel.id} on guild ${connection.channel.guild.id}`);
        });

        connection.on('speaking', (user, speaking) => { // emitted whenever a user changes speaking state
            let filename = saveFiles ? `${channelFolder}/${user.id}_${new Date().getTime()}` : `${channelFolder}/${user.id}`;
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
                    speechClient.streamingRecognize(request)
                        .on('error', console.error)
                        .on('data', data => {
                            let transcript = data.results[0].alternatives[0].transcript;
                            console.log("[UPDATE]: Finished transcribing")
                            console.log(`[TRANSCRIPTION]: ${transcript}`);
                            message.channel.send(`**${nickname}**: ${transcript}`);

                            if (transcript.toLowerCase() == "disconnect" && user.id == summonerId) {
                                connection.disconnect();
                            }
                });

                console.log(`[UPDATE]: User ${user.id} is speaking!`);

                // start recording stream
                const audio = connection.receiver.createStream(user, { mode: 'pcm', end: 'silence' });
                let file = fs.createWriteStream(filename);

                audio.pipe(file);

                file.on('finish', () => {
                    console.log(`[UPDATE]: Audio file saved: ${filename}`);
                    let f = fs.createReadStream(filename);
                    f.pipe(recognizeStream);
                });
            }
            else if (speaking.bitfield === 0) {
                console.log(`[UPDATE]: User ${user.id} has stopped speaking!`);
            }
        });
    }
    catch (err) {
        console.log(`[ERROR]: ${err}`);
        return message.channel.send(err);
    }
}