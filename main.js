const { Client, Intents } = require('discord.js');

const intents = new Intents();
intents.add(Intents.ALL);

const client = new Client({ intents });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
const ytdl = require('ytdl-core');
let playlist = [];
let currentIndex = 0;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  if (message.content.startsWith("!add")) {
    let url = message.content.split(" ")[1];
    playlist.push(url);
    message.channel.send(`Added ${url} to the playlist`);
  } else if (message.content.startsWith("!playlist")) {
    message.channel.send(`Current Playlist: ${playlist.join(", ")}`);
  } else if (message.content.startsWith("!queue")) {
    let currentQueue = playlist.slice(currentIndex);
    message.channel.send(`Current Queue: ${currentQueue.join(", ")}`);
  } else if (message.content.startsWith("!play")) {
    if (playlist.length === 0) {
      message.channel.send("The playlist is empty! Add some songs using !add");
      return;
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      message.reply("Please join a voice channel first!");
      return;
    }

    voiceChannel
      .join()
      .then((connection) => {
        const play = (index) => {
          let stream = ytdl(playlist[index], { filter: "audioonly" });
          let dispatcher = connection.play(stream);
          dispatcher.on("start", () => {
            message.channel.send(`Playing ${playlist[index]}`);
          });
          dispatcher.on("finish", () => {
            currentIndex++;
            if (currentIndex === playlist.length) {
              message.channel.send("Playlist finished.");
              voiceChannel.leave();
            } else {
              play(currentIndex);
            }
          });
          dispatcher.on("error", (error) => {
            console.error(error);
            voiceChannel.leave();
          });
        };
        play(currentIndex);
      })
      .catch(console.error);
  } else if (message.content.startsWith("!pause")) {
    const dispatcher = client.voice.connections.first().dispatcher;
    if (dispatcher.paused) {
      message.channel.send("Music already paused");
    } else {
      dispatcher.pause();
      message.channel.send("Pausing...");
    }
  } else if (message.content.startsWith("!resume")) {
    const dispatcher = client.voice.connections.first().dispatcher;
    if (!dispatcher.paused) {
      message.channel.send("Music is not paused");
    } else {
      dispatcher.resume();
      message.channel.send("Resuming...");
    }
  } else if (message.content.startsWith("!skip")) {
    const dispatcher = client.voice.connections.first().dispatcher;
    if (dispatcher.paused) {
      message.channel.send("Can't skip a paused music");
    } else {
      currentIndex++;
      if (currentIndex === playlist.length) {
        message.channel.send("Playlist finished.");
        voiceChannel.leave();
      } else {
        play(currentIndex);
        message.channel.send(`Skipping to nextsong: ${playlist[currentIndex]}`);
      }
    }
  }
});

client.login(
  MTA2NDIzMDM1Nzk2NjI3MDUyNA.GcXlYi.h69hpYs1ubpZRiCWF69o-saqwWn9IKe0oC3hDo
);
