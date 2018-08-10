//glitch.com stuff
const http = require('http')
const express = require('express')
const app = express()
app.get("/", (request, response) => {
  response.sendStatus(200)
});
app.listen(process.env.PORT);

//randomSelection by RainbowNotFound
function randomSelection(choices) {
  return choices[Math.floor(Math.random() * choices.length)];
};

//and now the actual bot
const Discord = require('discord.js');
const client = new Discord.Client();
var isBotLive = false;

const Songs = ["https://cdn.glitch.com/d63e88df-e942-48e1-9e09-9b1d9df3f511%2FCheeki%20Breeki.mp3?1533410514541"];

client.on("ready", () => {
  console.log(`I'm ready`);

  client.user.setPresence({ game: { name: "Use !h join!", type: "PLAYING" } });
})

function infiniteLooper(dispatcherCB,connection){ //Has 0.001% of creating a black hole every bass drop
        dispatcherCB.on("end", () => {
            if(isBotLive){
              var dispatcher = () => connection.playStream(randomSelection(Songs));
              infiniteLooper(dispatcher(),connection);
            }
        });
}

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return

  if (message.content === '!h join' || message.content === `<@${client.user.id}> join`) {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply(`I have successfully connected to the channel **${message.member.voiceChannel.name}**!`);
          isBotLive = true;
          infiniteLooper(dispatcher(),connection);
        })
        .catch(console.log)
    } else {
      message.reply('You need to join a voice channel first!');
    }
  } else if (message.content === "!h leave" || message.content === `<@${client.user.id}> leave`) {
    if(message.member.voiceChannel) {
      try{
        message.member.voiceChannel.leave();
        message.channel.send(`I have successfully disconnected from the channel **${message.member.voiceChannel.name}**!`);
        isBotLive = false;
      }
      catch(err)
      {
        console.log(err);//Outputs "I am nub"
      }
    } else {
      message.channel.send(`I could not find your voice channel...`);
    }
  }
});

client.login(process.env.TOKEN);
