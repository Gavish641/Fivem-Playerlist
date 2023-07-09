const { InteractionType, Client, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageReaction, MessageSelectMenu } = require('discord.js');
const fivem = require("discord-fivem-api")

const config = require('./config.json')
const server = new fivem.DiscordFivemApi(`${config.serverIP}:30120`)
const client = new Client({
    intents: 32767
});
client.on("ready", () => {
    const guild = client.guilds.cache.get(config.discordID)
    console.log("Ready")
    const playerlist = []
    let i = 0
    const playerlistEmbed = new MessageEmbed()
    .setColor(config.serverColor)
    .setFooter({text: config.footer})
    .setTimestamp()
    const interval = setInterval (function () {
        server.getPlayers().then(async(data) => {
            console.log("update")
            client.user.setActivity(`(${data.length}/64)`, { type: 'PLAYING'})
            let result  = [];
            
            let index = 1;
            for (let player of data) {
                
                for (const ident of player.identifiers) {
                    
                    if(ident.startsWith("discord:")) {
                        const iddis = ident.substr(8, 25)
                        result.push(`**[ID:${player.id}]**  \`${player.name}\` <@${iddis}>\n`);
                        
                    }
                    
                }
            }
            let list = ""
            const embed = new MessageEmbed()
            .setColor(config.serverColor)
            .setAuthor({name: "Server is online" })
            .setTitle(`Players (${data.length}/64)`)
            .setFooter({text: config.footer})
            for (const player of result) {
                list += player
            }
            
            embed.setDescription(list)
            .setTimestamp()
            client.channels.cache.get(config.playerlistChannel).messages.fetch(config.playerlistMessage).then(msg => msg.edit({embeds: [embed]}));
        }).catch((err) => {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({name: "Server is offline" })
            .setTimestamp();
            client.channels.cache.get(config.playerlistChannel).messages.fetch(config.playerlistMessage).then(msg => msg.edit({embeds: [embed]}));
        });
    }, 10 * 1000)

    
})

client.on('messageCreate', async message => {
    if(message.guild.id !== config.discordID) return
    if(!message.member.permissions.has('ADMINISTRATOR')) return;
    if(message.content === "!playerlist") {
        const embed = new MessageEmbed()
        embed.setDescription(".")
        embed.setColor(config.serverColor)
        embed.setFooter({text: config.footer})
        message.channel.send({embeds: [embed]})
    }
})


client.login("your bot token")