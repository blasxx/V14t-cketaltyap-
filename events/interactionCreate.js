//============INTEGRATION CREATE EVENT============
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client){
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, ComponentType, ChannelType, PermissionsBitField} = require('discord.js')
        const conf = client.config
        const time = new Date()
        if (!interaction.isButton()) return
        if (interaction.customId == "ticketEmbed"){
            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id+'-ticket')){
                return interaction.reply({
                    content: 'Zaten bir açık biletiniz var!',
                    ephemeral: true
                })
            }
            interaction.guild.channels.create({
                name: 'ticket-'+interaction.user.username,
                topic: interaction.user.id+'-ticket',
                type: ChannelType.GuildText,
                permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: conf.adminRole,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                }],
            }).then(async (c)=>{
                interaction.reply({
                    content: 'Bilet oluşturuldu! Lütfen bir bilet kategorisi seçin! <#'+c.id+'>',
                    ephemeral: true
                })
                const embed = new EmbedBuilder()
                .setColor('#00bd6d')
                .setAuthor({
                    name: 'Kategori seçimi'
                })
                .setDescription('**Lütfen bir dakika içinde bir bilet kategorisi seçin, aksi takdirde silinecektir!**')
                .setThumbnail(conf.thumbImage)
                .setFooter({
                    text: conf.footerText
                })
                const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('categotySelect')
                    .setPlaceholder('bir kategori seç')
                    .addOptions(
                        {
                            label: conf.Tickets.Category1.CateroryLabel,
                            description: conf.Tickets.Category1.CategoryDescription,
                            value: conf.Tickets.Category1.CateroryLabel,
                            emoji: conf.Tickets.Category1.CategoryEmoji,
                        },
                        {
                            label: conf.Tickets.Category2.CateroryLabel,
                            description: conf.Tickets.Category2.CategoryDescription,
                            value: conf.Tickets.Category2.CateroryLabel,
                            emoji: conf.Tickets.Category2.CategoryEmoji,
                        },
                        {
                            label: conf.Tickets.Category3.CateroryLabel,
                            description: conf.Tickets.Category3.CategoryDescription,
                            value: conf.Tickets.Category3.CateroryLabel,
                            emoji: conf.Tickets.Category3.CategoryEmoji,
                        },
                    ))
                msg = await c.send({
                    content: '<@'+interaction.user.id+'>',
                    embeds: [embed],
                    components: [row]
                })
                const ctor = msg.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect,
                    time: 60000
                })
                ctor.on('collect', (i) => {
                    if (i.user.id === interaction.user.id){
                        if(msg.deletable){
                            msg.delete().then(async () => {
                                const embed = new EmbedBuilder()
                                .setColor('ff9600')
                                .setAuthor({
                                    name: 'Bilet Oluşturuldu'
                                })
                                .setDescription('<@!'+interaction.user.id+'> kullanıcısı - **'+i.values[0]+'** kategorisinde bir bilet oluşturdu')
                                .setThumbnail(conf.thumbImage)
                                .setFooter({
                                    text: conf.footerText
                                })
                                const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('deleteChan')
                                    .setLabel('Bileti Sil')
                                    .setEmoji('👿')
                                    .setStyle(ButtonStyle.Danger),
                                )
                                const chn = await c.send({
                                    content: '<@&'+conf.adminRole+'>',
                                    embeds: [embed],
                                    components: [row]
                                })
                                chn.pin().then(() => {
                                    chn.channel.bulkDelete(1)
                                })
                            })
                        }
                        if (i.values[0] == conf.Tickets.Category1.CateroryLabel){
                            c.edit({
                                parent: conf.Tickets.Category1.ChannelParent
                            })
                        }
                        if (i.values[0] == conf.Tickets.Category2.CateroryLabel){
                            c.edit({
                                parent: conf.Tickets.Category2.ChannelParent
                            })
                        }
                        if (i.values[0] == conf.Tickets.Category3.CateroryLabel){
                            c.edit({
                                parent: conf.Tickets.Category3.ChannelParent
                            })
                        }
                    }
                })
                ctor.on('end', (ctd)=> {
                    if(ctd.size < 1){
                        c.send('Bir kategori seçmediniz, bilet 10 saniye içinde silinecek!').then(() => {
                            setTimeout(() => {
                                if (c.deletable) {
                                    c.delete()
                                }
                            }, 9000)
                        })
                    }
                })

            })
        }
        if (interaction.customId == "deleteChan"){
            const embed = new EmbedBuilder()
            .setColor('#00bd6d')
            .setAuthor({
                name: 'Bilet Silme'
            })
            .setDescription('**Bileti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!**')
            .setThumbnail(conf.thumbImage)
            .setFooter({
                text: conf.footerText
            })
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('not')
                .setLabel('iptal etmek')
                .setEmoji('☺️')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('yes')
                .setLabel('silmek')
                .setEmoji('😱')
                .setStyle(ButtonStyle.Danger),
            )
            interaction.reply({
                embeds: [embed],
                components: [row]
            })
        }
        if (interaction.customId == "not"){
            const embed = new EmbedBuilder()
            .setColor('#00bd6d')
            .setAuthor({
                name: 'Bilet Silme'
            })
            .setDescription('**Bilet silme işlemini iptal ettiniz!**')
            .setThumbnail(conf.thumbImage)
            .setFooter({
                text: conf.footerText
            })
            interaction.reply({
                embeds: [embed]
            })
        }
        if (interaction.customId == "deletestop"){
            const embed = new EmbedBuilder()
            .setColor('#00bd6d')
            .setAuthor({
                name: 'Bilet Silme'
            })
            .setDescription('**Bilet silme işlemini iptal ettiniz!**')
            .setThumbnail(conf.thumbImage)
            .setFooter({
                text: conf.footerText
            })
            interaction.reply({
                embeds: [embed]
            })
            client.db.set(msg.channel.id,'nodelete')
        }
        if (interaction.customId == "yes"){
            const embed = new EmbedBuilder()
            .setColor('#00bd6d')
            .setAuthor({
                name: 'Bilet Silme'
            })
            .setDescription('**Biletin silinmesini onayladınız. Yakında kaldırılacak!**')
            .setThumbnail(conf.thumbImage)
            .setFooter({
                text: conf.footerText
            })
            interaction.reply({
                embeds: [embed]
            })
            setTimeout(() => {
                const delChan = client.channels.cache.get(interaction.channel.id)
                delChan.delete().then((i)=>{
                    console.log('\x1b[1m\x1b[33m'+time+' \x1b[37m| \x1b[32mINFO \x1b[37m| \x1b[36mКанал \x1b[33m'+i.id+' \x1b[36mбыл удалён.\x1b[0m')
                }).catch((e)=>{
                    console.log('\x1b[1m\x1b[33m'+time+' \x1b[37m| \x1b[31mERROR \x1b[37m| \x1b[36mПроизошла Ошибка > \x1b[31m'+e+'\x1b[0m')
                })
            }, 1000)
        }
    }
}