const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const CHANNEL_ID = '850155403349065751';
const GUILD_ID = '850155402141237318';
const VIDEO_URL = "https://www.youtube.com/watch?v=i46lq8NS2JI";

client.once('ready', async () => {
  console.log('Bot is online');

  const channel = await client.channels.fetch(CHANNEL_ID);

  const connection = joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  function play() {
    const stream = ytdl(VIDEO_URL, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    player.play(resource);
  }

  play();

  player.on(AudioPlayerStatus.Idle, () => {
    play(); // 🔁 loop forever
  });

  connection.subscribe(player);

  connection.on('stateChange', () => {
    // auto-reconnect logic can go here
  });
});

client.login(process.env.TOKEN);
