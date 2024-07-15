
const { Command } = require("../../../../Global/Structures/Default.Commands");

class Type extends Command {
    constructor(client) {
        super(client, {
            name: "yaz",
            description: "Kendi yazınızı bota yazdırırsınız.",
            usage: "yaz",
            category: "Founders",
            aliases: [],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if(!args[0]) return message.react(message.guild.findEmoji(system.Emojis.Iptal))
        message.delete();
        message.channel.send({ content: args.join(' ')});
    }
}

module.exports = Type

