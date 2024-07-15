
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas")
class Name extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            description: "Sunucu içerisi bir üyeyi kayıtsıza atmanızı sağlar.",
            usage: "kayıtsız <ID>",
            category: "Register",
            aliases: ["ks", "kayitsiz", "unregister", "ur"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}ks <<ID>>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (aris?.unregisterRoles.some(x => member.roles.cache.has(x))) return message.channel.send({ content: system.Replys.Registered }).sil(20)
        await member.setRoles(aris?.unregisterRoles).catch(err => { })
        await member.setNickname(`${aris?.tags.some(x => member.user.tag.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} İsim | Yaş`)
        message.react(message.guild.findEmoji(system.Emojis.Onay))
        message.channel.send({ content: `Başarılı bir şekilde ${member} (\`${member.id}\`) kişisi ${message.member} (\`${message.member.id}\`) kişisi tarafından kayıtsıza atıldı! ${message.guild.findEmoji(system.Emojis.Onay)}` }).sil(100)
        message.guild.findChannel("register-log").send({ embeds: [
            embed.setDescription(`
\`>\` Sunucuda bir üye kayıtsıza atıldı! ${message.guild.findEmoji(system.Emojis.Iptal)}

Kayıtsıza atan kişi : ${message.member} (\`${message.member.id}\`)
Kayıtsıza atılan kişi : ${member} (\`${member.id}\`) 
`)
        ]})
    }
}

module.exports = Name