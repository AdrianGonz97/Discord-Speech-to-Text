const fs = require('fs');

module.exports = function (folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
      console.log(`[UPDATE]: Folder created: ${folderPath}`);
    }
  }
  catch (err) {
    console.error(err)
  }
}