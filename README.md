# Discord-Speech-to-Text
## **UNDER CONSTRUCTION**
**WARNING: NOT COMPATIBLE WITH THE BROWSER VERSION OF DISCORD!**
## About
Discord-Speech-to-Text is a simple to use Discord Bot that joins a user's voice channel 
and transcribes speech to text, outputting the transcribed text into the text channel 
that the bot was summoned from. The bot is able to transcribe multiple users in the same 
channel at the same time, even when they are speaking over each other.

This bot utilizes [Google's Speech-To-Text API](https://cloud.google.com/speech-to-text). 
Here are the [features](https://cloud.google.com/speech-to-text#section-11) that are supported by the bot:
- Global vocabulary support for over 125 languages and variants
- Streaming speech recognition
- Automatic punctuation

## Usage
### Inviting the Bot:
**(NOT ACTIVE):** To invite this bot to your server, use the invitation link [here](https://discord.com/api/oauth2/authorize?client_id=813489147092271196&permissions=791931984&scope=bot).

**NOTE: Public use for this bot is not ready. Speech-to-Text-Bot will NOT be running at all times for now.**  

### Summoning the Bot:
To begin transcription, join a voice channel and type the following command into 
the text channel you want to have the transcription output to:

    !transcribe

This will summon the bot into your current voice channel and begin transcribing. 
All output will go into the text channel that the bot was summoned from.

### Dismissing the Bot:
When the session is completed, type the following command to dismiss the bot:

    !disconnect

The user who summoned the bot can also vocally say the command `disconnect` to the bot
to dismiss it as well.
## Installation For Self-Hosting
### Requirements:
- [Node.js](https://nodejs.org/)
- [Google Cloud Account](https://cloud.google.com/) - a free 90 day trial with a $300 credit can be used
- [Discord Bot Application](https://discord.com/developers/applications) - written with the assumption you know how to create a discord application, bot, and adding it to your server

### Guide:
- Clone this repository.
- Run the `npm install` command in a terminal from this project's directory.
- In your [Google Cloud Platform Dashboard](https://console.cloud.google.com/home/dashboard), create a project and an IAM role (you can set the role to "owner" for simple testing - **NOT recommended for production builds**).
- Create a **Service Account** for your new project in the Google Cloud Dashboard by selecting **'Go to project settings'**.
- Once created, select the **Service Account**, click on the **'Keys'** tab at the top, press **'Add Key'**, then **'Create a Key'** (JSON), and save the credentials file.
- From the Google Platform Dashboard, go to **APIs & Services** > **Dashboard**, click **'+ ENABLE APIS AND SERVICES'**, type **'Speech-to-text'** in the search bar, select **'Cloud Speech-to-Text API'**, and press **Enable**.
- Copy the path location for the credentials file and paste to it's respective location in the `dotenv-example` file.
- Rename the `dotenv-example` file to `.env` and modify file's content to your liking.
- Create a [Discord Bot Application](https://discord.com/developers/applications), then create a bot, paste the bot's token into the `.env` file, and invite it to your server with Administrator permissions.
- To run, enter `npm start` in a terminal from the project's directory. An `app.log` will be created in the project directory for logging purposes.

## Additional Notes
Due to the billing methods that Google's API implements, charges can quickly rack up. Take advantage of the free credit that Google provides to get a good idea of your consumption.