# Discord-Speech-to-Text
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
To invite this bot to your server, use the invitation link [here](https://discord.com/api/oauth2/authorize?client_id=813489147092271196&permissions=791931984&scope=bot).

### Summoning the Bot:
To begin transcription, join a voice channel and type the following command into 
the text channel you want to have the transcription output to:

    !transcribe

This will summon the bot into your current voice channel and begin transcribing. 
All output will go into the text channel that the bot was summoned from.

### Dismissing the Bot:
When the session is completed, type the following command to dismiss the bot:

    !disconnect

## Installation For Self-Hosting
TBD