//glitch.com stuff
const http = require('http')
const express = require('express')
const app = express()
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received")
  response.sendStatus(200)
})
app.listen(process.env.PORT)
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)


//and now the actual bot
const Discord = require('discord.js')
const client = new Discord.Client()

client.login(process.env.token)

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return

  if (message.content === '/join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('I have successfully connected to the channel!')
        })
        .catch(console.log)
    } else {
      message.reply('You need to join a voice channel first!')
    }
  }
})