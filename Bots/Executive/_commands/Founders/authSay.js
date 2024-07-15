
const { Command } = require("../../../../Global/Structures/Default.Commands");
class AuthSay extends Command {
    constructor(client) {
        super(client, {
            name: "ysay",
            description: "Sunucu içerisi seste olmayan yetkilieri sayar!",
            usage: "ysay",
            category: "Founders",
            aliases: ["yetkilisay", "yetkilises"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris, c) {
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id) && !c) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let sesdeolmayanlar = message.guild.members.cache.filter(y => aris?.registerHammer.some(x => y.roles.cache.has(x))).filter(ys => !ys.voice.channel && ys.presence && ys.presence.status != "offline")
        message.channel.send({ content: `Sesde olmayan yetkililer (${sesdeolmayanlar.size}); \n\n${sesdeolmayanlar.map(y => `${y}`).join(', ')}` })

    }
}

module.exports = AuthSay

