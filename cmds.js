const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('./config.json')
function del(msg,client){
    if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({content: '**Вы не можете использовать команды администратора.**'})
    else if(msg.channel.parentId==config.Tickets.Category1.ChannelParent || msg.channel.parentId==config.Tickets.Category2.ChannelParent || msg.channel.parentId==config.Tickets.Category3.ChannelParent){
        const time = new Date()
        function getId(id){
            var t = client.db.get(id)
            return t
        }
        const embed = new EmbedBuilder()
        .setColor('#00bd6d')
        .setAuthor({
            name: 'Bileti sil!'
        })
        .setDescription('**Bilet 30 saniye içinde kalıcı olarak silinecek!**')
        .setThumbnail(config.thumbImage)
        .setFooter({
            text: config.footerText
        })
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('deletestop')
            .setLabel('iptal etmek')
            .setEmoji('☺️')
            .setStyle(ButtonStyle.Success),
        )
        msg.reply({
            embeds: [embed],
            components: [row]
        })
        client.db.set(msg.channel.id,'delete')
        setTimeout(() => {
            if(getId(msg.channel.id)=='delete'){
                msg.channel.delete().then((i)=>{
                    console.log('Kanal Zaten Silindi')
                }).catch((e)=>{
                    console.log('Hata İle Karşılandı')
                })
            }
            else{
                msg.channel.send({
                    content: "Kanal silinmedi"
                })
            }
        }, 30000)
    }
    else{
        msg.channel.send({
            content:'**Bu kanal silinemez.**'
        })
    }
}
var comms_list = [
  {
    name: "del",
    out: del,
    about: "Kanalı sil."
  }
]
module.exports.comms = comms_list