
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Invites, messageUser, messageUserChannel, voiceUser, voiceUserChannel, User, Upstaff, voiceJoinedAt } = require("../../../../Global/Settings/Schemas");
const { ContextMenuCommandBuilder } = require("discord.js");
class MyRank extends Command {
    constructor(client) {
        super(client, {
            name: "veriler",
            description: "Sunucu içerisi detaylı yükseltim bilgilerinizi gösterir.",
            usage: "veriler",
            category: "Stat",
            aliases: ["yetkim", "görevler", "sorumluluk", "yetkilerim", "verilerim", "ystat"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        if (aris?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (aris?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`Positron Kurucuları\` ile iletişime geçin!` }).sil(80);
        if (!aris?.registerHammer.some(oku => member.roles.cache.has(oku))) return message.channel.send({ content: `\`Hata:\` Bu üye bir yetkili değil!` }).sil(10);
        
        //COIN DATA
        let upData = await Upstaff.findOne({ guildID: message.guild.id, userID: member.id });
        const maxValue = aris?.staffRanks[aris?.staffRanks.indexOf(aris?.staffRanks.find((x) => x.coin >= (upData ? Math.floor(upData.coin) : 0)))] || aris?.staffRanks[aris?.staffRanks.length - 1];
        let currentRank = aris?.staffRanks.filter(x => (upData ? Math.floor(upData.coin) : 0) >= x.coin);
        currentRank = currentRank[currentRank.length - 1];

        //REGISTER COIN
        let teyit = await User.findOne({ userID: member.id }) || [];
        let ety = teyit?.Confs.filter(v => v.Gender === "man").length || 0
        let kty = teyit?.Confs.filter(v => v.Gender === "woman").length || 0
        let kpuan = ety + kty * aris?.registerCoin || 0

        //INVITE COIN
        let idata = await Invites.findOne({ guildID: message.guild.id, inviterID: member.id })
        let ipuan = idata?.regular + idata?.bonus * aris?.inviteCoin || 0

        //VOICE / MESSAGE
        let mpuan = upData?.messageStat * aris?.messageCoin || 0
        let vpuan = upData?.voiceStat * aris?.voiceCoin || 0

        const seen = await voiceUser.findOne({ userID: member.id });

        //AUTH DATA

        const authData = await User.findOne({ userID: member.id })
        const Nokta = message.guild.emojis.cache.find(emoji => emoji.name === "Nokta");
        const iptal = message.guild.emojis.cache.find(emoji => emoji.name === "Iptal");



        let sayfa = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("bir").setEmoji("1227626269500379187").setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder().setCustomId("iki").setEmoji("1227626259509547088").setStyle(Discord.ButtonStyle.Secondary)
        )

        let yetkim = await message.channel.send({
            components: [sayfa],
            embeds: [embed.setAuthor({ name: member.user.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048})}).setDescription(`
${Nokta} ${member} Adlı Yetkilinin Yükseltim Bilgileri

${Nokta} \`   Yetki Tarihi         \` **${authData?.Auth ? `${message.guild.members.cache.get(authData?.AuthAuth) ? `<@${authData?.AuthAuth}> (<t:${Math.floor(authData?.AuthDate / 1000)}:R>)` : `<@${client.user.id}> (<t:${Math.floor(authData?.AuthDate / 1000)}:R>)`}` : "Bulunmamaktadır!"}**
${Nokta} \`   Son Ses Görülmesi    \` ${seen?.lastSeen ? `<t:${String(seen?.lastSeen).slice(0, 10)}:R>` : "**Bulunmamaktadır!**"}
${Nokta} \`   Görev                \` **${upData?.Gorev ? upData?.Gorev : `${iptal}` + " Görevin Bulunmamaktadır!"}** 
${Nokta} \`   Görev İlerlemen      \` ${upData?.Gorev ? `${progresss(upData?.YapilanGorev ? upData?.YapilanGorev : 0, upData?.GorevAdet, 5, message)} (${upData?.YapilanGorev ? `${upData?.YapilanGorev} / ${upData?.GorevAdet} ` : `0 / ${upData?.GorevAdet}` })` : `${iptal}` + " **Görevin Bulunmamaktadır!**"} 
${Nokta} \`   Finish Görev         \` **${upData?.ToplamGorev ? upData?.ToplamGorev : `${iptal}` + " Bitmiş Görevin Yok"}**
${Nokta} \`   Yükseltim Bilgileri  \` ${progresss(upData ? Math.floor(upData?.coin) : 0, maxValue.coin, 5, message)} \` ${upData ? Math.floor(upData.coin) : 0} / ${maxValue.coin} \`
${Nokta} \`   Yükseltim Rol(leri)  \` ${currentRank ? `${currentRank !== aris?.staffRanks[aris?.staffRanks.length - 1] ? `${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " & " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`}  __**${Math.floor(maxValue.coin - upData.coin)}**__ Veri Eksik!` : "Evet Sen Şuanda Son Yetkidesin Tebrikler!"}` : `${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " & " + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} Rolüne __**${maxValue.coin - (upData ? Math.floor(upData.coin) : 0)}**__ Veri Eksik!`}
`)]
        })
       


        var filter = (button) => button.user.id === message.member.id;
        let collector = await yetkim.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (button) => {
            button.deferUpdate();
            if (button.customId == "bir") {
                if (yetkim) yetkim.edit({
                    embeds: [embed]
                })
            } 
            if (button.customId == "iki") {
                if (yetkim) yetkim.edit({
                    embeds: [new Discord.EmbedBuilder().setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }) }).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setDescription(`
 ${Nokta} Adlı Yetkilinin __**${message.guild.name}**__ Puan Bilgileri

${Nokta} \`   Toplam Puan  \` **${upData?.coin ? Math.floor(upData?.coin) : `${iptal}` + "Puan Bulunmamaktadır!"}**
${Nokta} \`   Görev Puan   \` **${upData?.ToplamPuan ? upData?.ToplamPuan : `${iptal}` + "Puan Bulunmamaktadır!"}**
                   
                    `)] })
            }
        })

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                sayfa.components[0].setDisabled(true)
                sayfa.components[1].setDisabled(true)
                if (yetkim) yetkim.edit({ components: [sayfa] })
            }
        })
    }
}

function progresss(value, maxValue, size, message) {
    let fills = message.guild.emojis.cache.find(x => x.name == "doluBar")
    let emptys = message.guild.emojis.cache.find(x => x.name == "bosBar")
    let fillStarts = message.guild.emojis.cache.find(x => x.name == "baslangicBar")
    let emptyEnds = message.guild.emojis.cache.find(x => x.name == "bosBitisBar")
    let fillEnds = message.guild.emojis.cache.find(x => x.name == "doluBitisBar")

    let fill = `<:` + fills.name + `:` + fills.id + `>`
    let empty = `<:` + emptys.name + `:` + emptys.id + `>`
    let fillStart = `<:` + fillStarts.name + `:` + fillStarts.id + `>`
    let emptyEnd = `<:` + emptyEnds.name + `:` + emptyEnds.id + `>`
    let fillEnd = `<:` + fillEnds.name + `:` + fillEnds.id + `>`

    const progress = Math.round(size * ((value / maxValue) > 1 ? 1 : (value / maxValue)));
    const emptyProgress = size - progress > 0 ? size - progress : 0;

    const progressText = fill.repeat(progress);
    const emptyProgressText = empty.repeat(emptyProgress);

    return emptyProgress > 0 ?
        fillStart +
        progressText + emptyProgressText +
        emptyEnd
        : fillStart +
        progressText + emptyProgressText +
        fillEnd;
};
module.exports = MyRank