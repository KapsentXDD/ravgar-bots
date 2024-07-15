
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Invites, messageUser, messageUserChannel, voiceUser, voiceUserChannel, User, Economy, camUser, camUserChannel, streamUser, streamUserChannel, Orientation } = require("../../../../Global/Settings/Schemas")
class Stat extends Command {
    constructor(client) {
        super(client, {
            name: "stat",
            description: "Sunucu içerisi detaylı istatistik bilgilerinizi gösterir.",
            usage: "stat",
            category: "Stat",
            aliases: ["me", "istatistik", "invite", "invites", "coin"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('statdetay')
                    .setPlaceholder('Diğer İstatistik Bilgileri İçin Tıkla!')
                    .addOptions(
                        {
                            label: 'Diğer Bilgiler',
                            value: 'invitebilgi',
                        },
                    ),
            );

        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let messageTop;
        Active1.length > 0 ? messageTop = Active1.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `${message.guild.channels.cache.get(x.channelID).name}: \`${Number(x.channelData).toLocaleString()} Mesaj\``).join("\n") : messageTop = "İstatistik Bulunmamaktadır"

        const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let voiceTop;
        Active2.length > 0 ? voiceTop = Active2.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `${message.guild.channels.cache.get(x.channelID).name}: \`${moment.duration(x.channelData).add(x.seconds, 'seconds').format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n") : voiceTop = "- Ses Datası Boş";

        const camData = await camUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active3 = await camUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let camTop;
        Active3.length > 0 ? camTop = Active3.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `${message.guild.channels.cache.get(x.channelID).name}: \`${moment.duration(x.channelData).add(x.seconds, 'seconds').format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n") : camTop = "- Ses Datası Boş";

        const streamData = await streamUser.findOne({ guildID: message.guild.id, userID: member.id });
        const Active4 = await streamUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });
        let streamTop;
        Active4.length > 0 ? streamTop = Active4.filter((a) => message.guild.channels.cache.get(a.channelID)).splice(0, 10).map(x => `${message.guild.channels.cache.get(x.channelID).name}: \`${moment.duration(x.channelData).add(x.seconds, 'seconds').format("H [Saat], m [Dakika], s [Saniye]")}\``).join("\n") : streamTop = "- Ses Datası Boş";


        const coin = await Economy.findOne({ userID: message.member.id });
        const ori = await Orientation.findOne({ discordId: member.id });
        const orientationBy = ori ? ori.orientationBy : "Oryantasyon almadı.";

        let useauths = await User.findOne({ userID: member.id })

        const Nokta = message.guild.emojis.cache.find(emoji => emoji.name === "Nokta");

        const stat = await message.channel.send({
            components: [row], embeds: [
                embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setDescription(`
${member} Adlı Üyenin Stat Bilgileri

${Nokta} \` Toplam Mesaj Sayısı \` **${messageData ? messageData.topStat : "0"}** Mesaj
${Nokta} \` Haftalık Mesaj Sayısı \` **${messageData ? messageData.weeklyStat : 0}** Mesaj
${Nokta} \` Günlük Mesaj Sayısı \` **${messageData ? messageData.weeklyStat : 0}** Mesaj

${Nokta} \` Toplam Ses İstatistikleri \` **${moment.duration(voiceData ? voiceData.topStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Haftalık Ses İstatistikleri \` **${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Günlük Ses İstatistikleri \` **${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**

${Nokta} \` Toplam Kamera İstatistikleri \` **${moment.duration(camData ? camData.topStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Haftalık Kamera İstatistikleri \` **${moment.duration(camData ? camData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Günlük Kamera İstatistikleri \` **${moment.duration(camData ? camData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**

${Nokta} \` Toplam Yayın İstatistikleri \` **${moment.duration(streamData ? streamData.topStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Haftalık Yayın İstatistikleri \` **${moment.duration(streamData ? streamData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**
${Nokta} \` Günlük Yayın İstatistikleri \` **${moment.duration(streamData ? streamData.weeklyStat : 0).format("H [Saat], m [Dakika]")}**

\`\`\`js
${messageTop}
-------
${voiceTop}
\`\`\`
`)
            ]
        })

        var filter = (component) => component.user.id === message.author.id;
        const collector = stat.createMessageComponentCollector({ filter, time: 30000 });
        collector.on('collect', async (interaction) => {
            interaction.deferUpdate(true);
            if (interaction.customId == "statdetay") {
                if (interaction.values[0] == "invitebilgi") {
                    let idata = await Invites.findOne({ guildID: message.guild.id, inviterID: member.id });
                    let chatMute = 0;
                    let voiceMute = 0;
                    let ban = 0;
                    let jail = 0;
        
                    if (aris?.banHammer.some(x => member.roles.cache.has(x)) || aris?.jailHammer.some(x => member.roles.cache.has(x)) || aris?.vmuteHammer.some(x => member.roles.cache.has(x)) || aris?.muteHammer.some(x => member.roles.cache.has(x)) || aris?.registerHammer.some(x => member.roles.cache.has(x)) || aris?.foundingRoles.some(oku => member.roles.cache.has(oku)) || member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                        if (useauths) {
                            chatMute = useauths.UseMute || 0;
                            voiceMute = useauths.UseVMute || 0;
                            ban = useauths.UseBan || 0;
                            jail = useauths.UseJail || 0;
                        }
                    }
                    const seen = await voiceUser.findOne({ userID: member.id });
                    const lastSeenString = seen?.lastSeen ? `<t:${Math.floor(seen.lastSeen / 1000)}:R>` : "**Veri yok**";
                    if (stat) stat.edit({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(`
${idata ? `${member} İsimli Üyenin Diğer Bilgileri

${Nokta} \` Son Ses Aktifliği \` ${lastSeenString}
${Nokta} \` Sunucuya Giriş Tarihi \` <t:${Math.floor(interaction.member.joinedAt / 1000)}:R>
${Nokta} \` Hesap Açılış Tarihi \` <t:${Math.floor(interaction.member.user.createdAt / 1000)}:R>
${Nokta} \` Oryantasyon Durumu: \` <@${orientationBy}>
        
${Nokta} __**${chatMute}**__ Chat Mute 
${Nokta} __**${voiceMute}**__ Ses Mute
${Nokta} __**${jail}**__ Jail
${Nokta} __**${ban}** __ Ban Komutu Kullanmıştır.
${Nokta} __**${idata.regular + idata.bonus}**__ Adet İnvite Bilgisi Bulunmaktadır.` : `${member} Adlı Üyenin Davet Bilgisi Bulunmamaktadır.`}
                            `)
                        ]
                    });
                }
            }
        });
        
        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                row.components[0].setDisabled(true)
                if (stat) stat.edit({ components: [row] })
            }
        })
    }
}

module.exports = Stat
