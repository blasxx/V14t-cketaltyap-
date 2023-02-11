//=========-TicketsSystem BY Alpha-==========
//==================-VAR`S-==================
const config = require('./config.json')
const { Client,GatewayIntentBits} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.MessageContent,GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildIntegrations]})
const db = require('qjson-db')
client.db = new db('./data/DB.json')
client.config = config
const fs = require('fs')
//=================-DISCORD-==================
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of events){
    const event = require(`./events/${file}`)
    client.on(event.name, (...args) => event.execute(...args, client))
}
client.on('messageCreate', (msg) => {
    const comms = require("./cmds.js")
    if (msg.author.username != client.user.username && msg.author.discriminator != client.user.discriminator){
      var comm = msg.content.trim() + " "
      var comm_name = comm.slice(0, comm.indexOf(" "))
      for (comm_count in comms.comms) {
        var comm2 = config.prefix + comms.comms[comm_count].name
        if (comm2 == comm_name){
          comms.comms[comm_count].out(msg,client)
        }
      }
    }
  }
)
client.login("OTM4MjMwNzgxODIwNjY1OTU3.GsuZmj.VAORP1P7vvlI_rwAfcAjsyA6fwCBkVU933Hkh8")
//===================-MAIN-===================