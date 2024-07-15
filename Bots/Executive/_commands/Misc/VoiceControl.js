
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { voiceJoinedAt } = require("../../../../Global/Settings/Schemas")
class VoiceControl extends Command {
    constructor(client) {
        super(client, {
            name: "nerede",
            description: "Sunucu içerisi bir üyenin ses kanalını gösterir.",
            usage: "nerede <ID>",
            category: "Misc",
            aliases: ["n", "seskontrol"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send({ content: `Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`.n <ID>\`` }).sil(20)
        if (!member.voice.channel) return message.channel.send({ content: `Bilgi: ${member}, (\`${member.id}\`) bir ses kanalında aktif değil.` }).sil(20)
        let joinedAtData = null;
        if (!member.user.bot) {
         joinedAtData = await voiceJoinedAt.findOne({ userID: member.id });
        }        
        let selfM = member.voice.selfMute ? `**KAPALI**` : `**AÇIK**`;
        let selfD = member.voice.selfDeaf ? `**KAPALI**` : `**AÇIK**`;
        let selfV = member.voice.selfVideo ? `**KAPALI**` : `**AÇIK**`;
        let selfS = member.voice.streaming ? `**KAPALI**` : `**AÇIK**`;
        message.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`
${member}, (\`${member.id}\`) Adlı Kullanıcı Şuanda 
\`${message.guild.channels.cache.get(member.voice.channelId).name}\` Adlı Ses Kanalında
Mikrofonu **${selfM}** 
Kulaklığı **${selfD}**
Kamerası **${selfV}** 
Yayını **${selfS}** Durumdadır.`)] }).sil(30)
     
    }
}// Embed Çevirildi To Content

module.exports = VoiceControl
