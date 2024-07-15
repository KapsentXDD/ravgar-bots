const { Event } = require("../../../../Global/Structures/Default.Events");
class RoleCreate extends Event {
    constructor(client) {
        super(client, {
            name: "roleCreate",
            enabled: true,
        });
    }

    async onLoad(role) {
        let entry = await role.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.RoleCreate }).then(audit => audit.entries.first());
        if (!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.safe(entry.executor.id, "Rol")) return;
        let member = role.guild.members.cache.get(entry.executor.id)

        const gorevler = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("baniac").setDisabled(member.bannable ? false : true).setLabel("İşlemi Yapan Kişinin Banı Aç!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("guvenliekle").setDisabled(aris?.Role.includes(entry.executor.id) ? true : false).setLabel("İşlemi Yapan Kişiyi Güvenliye Ekle!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("yetkileriac").setLabel("Sunucu Yetkilerini Tekrar Aç!").setStyle(Discord.ButtonStyle.Primary))
        let guardlog = await role.guild.channels.cache.find(x => x.name == "guard-log").send({
            components: [gorevler],
            content: `Sunucuda rol oluşturuldu! ${entry.executor} (\`${entry.executor.id}\`) tarafından rol oluşturuldu. Rol silindi ve Üye ${member.bannable ? "banlandı!" : "banlanamadı!"}`
        })
        var filter = (button) => aris?.foundingRoles.some(x => x == button.user.roles.cache.has(x)) || system.Bot.Roots.includes(button.user.id);
        const collector = guardlog.createMessageComponentCollector({ filter })
        collector.on('collect', async (button) => {
            button.deferUpdate();
            if (button.customId == "baniac") {
                button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`)
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisinin banını kaldırdın!` })
            }
            if (button.customId == "guvenliekle") {
                if (aris?.Role.includes(member.id)) return button.channel.send({ content: `${member} kişisi zaten güvenli listede!` })
                await ariscik.findOneAndUpdate({ guildID: role.guild.id }, { $push: { Role: member.id } }, { upsert: true })
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisini **Rol** kategorisinde güvenli ekledin!` })
            }
            if (button.customId == "yetkileriac") {
                const yetkipermler = await guildPerms.findOne({ guildID: system.Guild.ID });
                if (!yetkipermler) return;
                yetkipermler.roller.forEach((permission) => { const roles = role.guild.roles.cache.get(permission.rol); if (roles) roles.setPermissions(permission.perm); });
                await guildPerms.deleteMany({})
                button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde sunucudaki rollerin yetkilerini açtın!` })
            }
        })
    }
}

module.exports = RoleCreate;