const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "say",
    description: "Sunucu İçerisindeki Detaylı Bilgi Gösterme Komutudur.",
    type: ApplicationCommandType.ChatInput,

    async onLoad(client) {

    },
  
    async onRequest(client, message, args, embed, aris) {
        let sesli = message.guild.members.cache.filter(x => !x.user.bot && x.voice.channel).size
        let boost = message.guild.premiumSubscriptionCount;
        let aktif = message.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size
        message.reply({
            ephemeral: true,
            embeds: [new Discord.EmbedBuilder().setDescription(`
Sunucumuzda Toplam ${global.numberEmojis(message.guild.memberCount)} (**+** ${global.numberEmojis(aktif)} Aktif) Kişi Bulunmakta  
Ses kanallarında ${global.numberEmojis(sesli)} Kişi Bulunmakta`)]
        })
    }}


        