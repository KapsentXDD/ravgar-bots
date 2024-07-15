
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Orientation } = require("../../../../Global/Settings/Schemas")
class Oryantasyon extends Command {
    constructor(client) {
        super(client, {
            name: "oryantasyon",
            description: "Sunucu içerisi yetkili bir kişiye oryantasyon verilmesini sağlar.",
            usage: "Oryantasyon <ID>",
            category: "Stat",
            aliases: ["oryantasyon","orientation"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (member == message.member.id) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.ItSelf}` }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}oryantasyon <<ID>>\`` }).sil(20)
        if (aris?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (aris?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`Positron Kurucuları\` ile iletişime geçin!` }).sil(80);
        if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoAuth}` }).sil(10);
        if (!aris?.tags.some(a => member.user.displayName.includes(a)) && !aris?.tags.some(a => member.user.username.includes(a))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoTag}` }).sil(20)

        const existingOrientation = await Orientation.findOne({ discordId: member.id });

        if (existingOrientation) {
            return message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${member} kullanıcısına zaten oryantasyon verilmiş.`)] });
        }

        
        await Orientation.findOneAndUpdate(
            { discordId: member.id },
            { orientationBy: message.author },
            { upsert: true }
        );

       
        return message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`${member} kullanıcısına oryantasyon başarıyla verildi.`)] });
    } catch(error) {
        console.error("Oryantasyon verme işlemi sırasında bir hata oluştu:", error);
        return message.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`Oryantasyon verme işlemi sırasında bir hata oluştu.`)] });
    }

}
module.exports = Oryantasyon
