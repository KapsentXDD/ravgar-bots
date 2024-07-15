
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Device extends Command {
    constructor(client) {
        super(client, {
            name: "device",
            description: "Sunucuda belirlenen kişinin discorda girdiği platformu gösterir.",
            usage: "device <ID> ",
            category: "Moderation",
            aliases: ["cihaz", "cihazı"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

        let clientStatus = member.presence.clientStatus;
        let cihazEmbed = new Discord.EmbedBuilder()
        .setColor(Discord.Colors.DarkButNotBlack)
        .setDescription(`${member} üyesinin şu anki cihazları;\n\n${Object.keys(member.presence.clientStatus).map(c => `\`•\` ${c.replace("desktop", "Masaüstü Uygulaması").replace("mobile", "Mobil Cihaz").replace("web", "İnternet Tarayıcısı")} (${clientStatus[c].replace("online", "Çevrim içi").replace("dnd", "Rahatsız etmeyin").replace("idle", "Boşta")})`).join("\n")}`)
        message.channel.send({embeds: [cihazEmbed]});

    }
}

module.exports = Device