
const { Command } = require("../../../../Global/Structures/Default.Commands");
const moment = require("moment");
const ms = require("ms");
require("moment-duration-format");

class timedRole extends Command {
    constructor(client) {
        super(client, {
            name: "timedRole",
            description: "Zamanlı rol verme.",
            usage: "timedrole <<ID>>",
            category: "Founders",
            aliases: ["srol","süreli-rol","sürelirol"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let user = message.mentions.users.first()
        let roles = message.mentions.roles.first()
        if (!args[0]) return message.channel.send({ content: system.Replys.Member })
        if (!user) return message.channel.send({ content: `**${args[0]}**, kişisi sunucuda bulunmamakta!` })
        if (!args[1]) return message.channel.send({ content: system.Replys.Role })
        if (!roles) return message.channel.send({ content: `**${args[1]}**, rolü sunucuda bulunmamakta.` })
        if (!args[2]) return message.channel.send({ content: `Rolün ne kadar süre içerisinde kullanıcıda kalacağını belirtmelisin.`})
        let süre = args[2];
        message.guild.members.cache.get(user.id).roles.add(roles.id)
        message.channel.send({ content:`${user} isimli kişiye ${message.author.username} tarafından ${süre.replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')} boyunca ${roles} rolü verildi!` }).then(mesaj => {
            setTimeout(async () => {
                message.guild.members.cache.get(user.id).roles.remove(roles.id)
                mesaj.edit({ content: `${roles}, için rol süresi doldu!` })
            }, ms(süre))
        })


    }
}

module.exports = timedRole

