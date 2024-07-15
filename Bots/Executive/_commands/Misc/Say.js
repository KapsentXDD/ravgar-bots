
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { ChannelType, PermissionsBitField } = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucu içerisi detaylı bilgileri öğrenmenizi sağlar.",
            usage: "say",
            category: "Misc",
            aliases: ["sy"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let sesli = message.guild.members.cache.filter(x => !x.user.bot && x.voice.channel).size
        let boost = message.guild.premiumSubscriptionCount;
        let aktif = message.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size
        let tag1 = message.guild.members.cache.filter(x => aris?.tags.some(tag => x.displayName.includes(tag))).size
        let tag2 = message.guild.members.cache.filter(x => aris?.tags.some(tag => x.user.username.includes(tag))).size
        let toplamtag = tag1 + tag2
        
        message.reply({
            ephemeral: true,
            embeds: [new Discord.EmbedBuilder().setDescription(`
Sunucumuzda Toplam ${global.numberEmojis(message.guild.memberCount)} (**+** ${global.numberEmojis(aktif)} Aktif) Kişi Bulunmakta  
Ses kanallarında ${global.numberEmojis(sesli)} Kişi Bulunmakta
Toplam ${global.numberEmojis(toplamtag)} Taglı Üyemiz Bulunmakta
Toplam ${global.numberEmojis(boost)} Boost Bulunmakta `)]
        })
    }}

module.exports = Say
