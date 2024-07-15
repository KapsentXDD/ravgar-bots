const { Command } = require("../../../../Global/Structures/Default.Commands");
const { messageUser, voiceUser, messageGuild, voiceGuild } = require("../../../../Global/Settings/Schemas");
const moment = require("moment");

class Leaderboard extends Command {
    constructor(client) {
        super(client, {
            name: "sesleader",
            description: "Sunucu içerisindeki en yüksek mesaj ve ses istatistiklerini gösterir.",
            usage: "sesleader",
            category: "Stat",
            aliases: ["sesleader"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onRequest(client, message, args, embed) {
        if (!system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(5)
        const ravgarDataTopSes = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });
        const voiceUsersList = ravgarDataTopSes.splice(0, 15).map((user, index) => `\`${index + 1}.\` <@${user.userID}>: \`${moment.duration(user.topStat).format("H [Saat], m [Dakika]")}\``).join(`\n`);
        const ravgarSes = embed.setDescription(`
__**${message.guild.name}**__ Sunucusunun **Top 15** __Ses__ Leaderboard İstatistikleri

${voiceUsersList}

Toplam Ses Süresi: \`${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [Saat], m [Dakika]")}\`
`);

        const ravgarss = await message.channel.send({ embeds: [ravgarSes] });

        setInterval(async () => {
            const ravgarDataTopSes = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
            const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });
            const voiceUsersList = ravgarDataTopSes.splice(0, 15).map((user, index) => `\`${index + 1}.\` <@${user.userID}>: \`${moment.duration(user.topStat).format("H [Saat], m [Dakika]")}\``).join(`\n`);
            const ravgaryenilenme = `<t:${Math.floor(Date.now() / 1000)}:R>`;

            const güncelleEmbedravgar = embed.setDescription(`
__**${message.guild.name}**__ Sunucusunun **Top 15** __Ses__ Leaderboard İstatistikleri

${voiceUsersList}

Toplam Ses Süresi: \`${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [Saat], m [Dakika]")}\`
Son Güncellenme Tarihi: ${ravgaryenilenme}
`);

            ravgarss.edit({ embeds: [güncelleEmbedravgar] });
        }, 10000);
    }
}

module.exports = Leaderboard;
