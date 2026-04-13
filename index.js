const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const ytdl = require('ytdl-core');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const CHANNEL_ID = '850155403349065751';
const GUILD_ID = '850155402141237318';
const VIDEO_URL = 'https://www.youtube.com/watch?v=i46lq8NS2JI';

let player;

client.once('ready', async () => {
  console.log('Bot is online');

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const connection = joinVoiceChannel({
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    player = createAudioPlayer();

    // IMPORTANT: subscribe BEFORE playing
    connection.subscribe(player);

    function play() {
      console.log("Starting playback...");

      const stream = ytdl(VIDEO_URL, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
      });

      stream.on('error', (err) => {
        console.log("Stream error:", err);
      });

      const resource = createAudioResource(stream);
      player.play(resource);
    }

    // Start first play
    play();

    // Loop forever
    player.on(AudioPlayerStatus.Idle, () => {
      console.log("Song ended, replaying...");
      play();
    });

    player.on('error', err => {
      console.log("PLAYER ERROR:", err);
      play();
    });

  } catch (err) {
    console.log("ERROR ON START:", err);
  }
});

client.login(process.env.TOKEN);
