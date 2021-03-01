const fs = require('fs');

module.exports = function (message) {
    console.log('[UPDATE]: Saving all cached messages to file');
    let cachedMsgs = message.channel.messages.cache;
    let file = fs.createWriteStream('channel-cache.txt');
    file.on('error', function(err) { console.log(err); });
  
    cachedMsgs.each(msg => {
      file.write(msg.toString() + '\n');
      //console.log(msg.toString());
    });
  
    file.end();
    console.log('[UPDATE]: Finished saving all cached messages to file');
    message.channel.send('Channel logs have been saved!');
}