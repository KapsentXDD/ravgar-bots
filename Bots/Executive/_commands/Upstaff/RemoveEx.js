
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Excuse } = require("../../../../Global/Settings/Schemas")
class RemoveEx extends Command {
    constructor(client) {
        super(client, {
            name: "mazeretSil",
            description: "Sunucu içerisi yetkili bir kişinin mazeretinin silinmesini sağlar.",
            usage: "Mazeretsil <ID>",
            category: "Stat",
            aliases: ["unmazeret","removeexcuse","rex","removexcuse","mazeretsil"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (member == message.member.id) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.ItSelf}` }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}mazeret <<Sebep>>\`` }).sil(20)
        if (aris?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (aris?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`Positron Kurucuları\` ile iletişime geçin!` }).sil(80);
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoAuth}` }).sil(10);
        if (!aris?.tags.some(a => member.user.displayName.includes(a)) && !aris?.tags.some(a => member.user.username.includes(a))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoTag}` }).sil(20)

        const deletedExcuse = await Excuse.findOneAndDelete({ authorID: member.id, guildID: message.guild.id });
            if (!deletedExcuse) return message.channel.send("Belirtilen kullanıcının mazereti bulunamadı.");

            const ravgar = new Discord.EmbedBuilder()
            .setDescription(`
            ${member} adlı kullanıcının mazereti sıfırlanmıştır eski mazeret bilgileri
            aşağıda bulunmaktadır.
            
            \` Silinen Kullanıcı : \` ${member}
            
            \` Silinen Mazeret : \` ${deletedExcuse.excuse}`)

        message.channel.send({ embeds: [ravgar] });

        
        } catch (error) {
            console.error("Mazeret silinirken bir hata oluştu:", error);
            message.channel.send("Mazeret silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }

    }
module.exports = RemoveEx
