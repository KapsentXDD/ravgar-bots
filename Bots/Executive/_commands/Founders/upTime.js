
const { Command } = require("../../../../Global/Structures/Default.Commands");
const moment = require("moment");
require("moment-duration-format");

class upTime extends Command {
    constructor(client) {
        super(client, {
            name: "uptime",
            description: "Botun ne zamandan beri aktif olduğunu görüntüler.",
            usage: "uptime",
            category: "Founders",
            aliases: [],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        message.reply({ content: (`**Bot \`${moment.duration(client.uptime).format('D [gün], H [saat], m [dakika], s [saniye]')}\` süredir açık!**`)});


    }
}

module.exports = upTime

