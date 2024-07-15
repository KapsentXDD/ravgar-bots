const { Command } = require("../../../../Global/Structures/Default.Commands");
const { messageUser, voiceUser, messageGuild, voiceGuild } = require("../../../../Global/Settings/Schemas");
const moment = require("moment");

class Leaderboard extends Command {
    constructor(client) {
        super(client, {
            name: "mesajleader",
            description: "Sunucu içerisindeki en yüksek mesaj ve ses istatistiklerini gösterir.",
            usage: "mesajleader",
            category: "Stat",
            aliases: ["mesajleader"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onRequest(client, message, args, embed) {
        if (!system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(5)
        const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
        const ravgarss = await message.channel.send({ embeds: [embed] });

        const updateEmbed = async () => {
            const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
            const messageUsersList = messageUsersData.splice(0, 15).map((user, index) => `\`${index + 1}.\` <@${user.userID}>: \`${Number(user.topStat).toLocaleString()} Mesaj\``).join(`\n`);
            const ravgaryenilenme = `<t:${Math.floor(Date.now() / 1000)}:R>`;

            const updatedravgarMesaj = embed.setDescription(`
__**${message.guild.name}**__ Sunucusunun **Top 15** __Mesaj__ Leaderboard İstatistikleri

${messageUsersList}

Toplam Mesaj Sayısı: \`${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()}\`
Son Güncellenme Tarihi: ${ravgaryenilenme}
`);
            ravgarss.edit({ embeds: [updatedravgarMesaj] });
        };
        updateEmbed(); 
        setInterval(updateEmbed, 10000); 
    }
}

module.exports = Leaderboard;
