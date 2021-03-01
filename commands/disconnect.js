module.exports = function (message) {
    const client = message.client;
    const voiceChannel = message.member.voice.channel;
  
    if (voiceChannel) {
      let isAlreadyInChannel = false;
      let currentConnection;
      client.voice.connections.each((connection) => {
        if (connection.channel.id == voiceChannel.id) {
          isAlreadyInChannel = true;
          currentConnection = connection;
        }
      });
  
      if (isAlreadyInChannel) {
        currentConnection.disconnect();
      } else {
        message.channel.send("Unable to disconnect from a channel that you are currrently not in!");
        console.log("[UPDATE]: Cannot fulfill disconnect command - user is not in the same channel as the bot");
      }
    } else {
      message.channel.send("Unable to disconnect from a channel that you are currrently not in!");
    }
}