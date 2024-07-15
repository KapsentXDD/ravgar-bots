const { Event } = require("../../../../Global/Structures/Default.Events");
const { AuditRole, guildPerms } = require("../../../../Global/Settings/Schemas")
class GuildMember extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberUpdate",
            enabled: true,
        });
    }

    async onLoad(newMember, oldMember) {
        const yetkiPermleri = ["8", "268435456", "16", "536870912", "4", "2", "134217728", "1073741824", "536870912"];
        let entry = await newMember.guild.fetchAuditLogs({ type: Discord.AuditLogEvent.MemberRoleUpdate }).then(audit => audit.entries.first());
        if (!entry || await client.safe(entry.executor.id, "EkleCikar")) return;
        let member = newMember.guild.members.cache.get(entry.executor.id)
        if (yetkiPermleri.some(p => !oldMember.permissions.has(p) && newMember.permissions.has(p))) {
            newMember.roles.set(oldMember.roles.cache.map(r => r.id)).catch(err => { })
            const gorevler = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("baniac").setLabel("İşlemi Yapan Kişinin Banı Aç!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("guvenliekle").setLabel("İşlemi Yapan Kişiyi Güvenliye Ekle!").setStyle(Discord.ButtonStyle.Danger), new Discord.ButtonBuilder().setCustomId("yetkileriac").setLabel("Sunucu Yetkilerini Tekrar Aç!").setStyle(Discord.ButtonStyle.Primary))
            puni(entry.executor.id, "ban")
            closeYt();
            if (!member.bannable) return gorevler.components[0].setDisabled(true);
            if (aris?.RoleAddRemove(entry.executor.id)) return gorevler.components[0].setDisabled(true);
            let guardlog = await newMember.guild.channels.cache.find(x => x.name == "guard-log").send({
                compontents: [gorevler],
                content: `${entry.executor} (\`${entry.executor.id}\`) tarafından ${newMember} (\`${newMember.id}\`) kişisine sağ tık ile yetki verildi! Veren kişi ${member.bannable ? "banlandı" : "banlanamadı"}!`
            })
            var filter = (component) => aris?.foundingRoles.some(x => x == button.user.roles.cache.has(x)) || system.Bot.roots.includes(button.user.id);
            const collector = guardlog.createMessageComponentCollector({ filter })
            collector.on('collect', async (button) => {
                button.deferUpdate();
                if (button.customId == "baniac") {
                    button.guild.members.unban(entry.executor.id, ` Buton Üzerinden Kaldırıldı!`)
                    button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisinin banını kaldırdın!` })
                }
                if (button.customId == "guvenliekle") {
                    if (aris?.RoleAddRemove(member.id)) return button.channel.send({ content: `${member} kişisi zaten güvenli listede mevcut!` })
                    await ariscik.findOneAndUpdate({ guildID: newMember.guild.id }, { $push: { RoleAddRemove: member.id } }, { upsert: true })
                    button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde ${entry.executor} (\`${entry.executor.id}\`) kişisini **Rol Ver/Al** kategorisinde güvenli ekledin!` })
                }
                if (button.customId == "yetkileriac") {
                    const yetkipermler = await guildPerms.findOne({ guildID: system.Guild.ID });
                    if (!yetkipermler) return;
                    yetkipermler.roller.forEach((permission) => { const role = newMember.guild.roles.cache.get(permission.rol); if (role) role.setPermissions(permission.perm); });
                    await guildPerms.deleteMany({})
                    button.channel.send({ content: `${button.user} Tebrikler! Başarılı bir şekilde sunucudaki rollerin yetkilerini açtın!` })
                }
            })
        } else {
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    newMember.guild.channels.cache.find(x => x.name == "role-log").send({
                        embeds: [new Discord.EmbedBuilder().setDescription(`
${entry.executor} (\`${entry.executor.id}\`) tarafından ${oldMember} (\`${oldMember.id}\`) kişisine sağ tık ile ${role} (\`${role.id}\`) rolü eklendi!
                        `)]
                    })
                    AuditRole.findOne({
                        user: oldMember.id
                    }, async (err, res) => {
                        if (!res) {
                            let arr = []
                            arr.push({
                                rol: role.id,
                                mod: entry.executor.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Ekleme"
                            })
                            let newData = new AuditRole({
                                user: oldMember.id,
                                roller: arr
                            })
                            newData.save().catch(e => console.log(e))
                        } else {
                            res.roller.push({
                                rol: oldMember.id,
                                mod: entry.executor.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Ekleme"
                            })
                            res.save().catch(e => console.log(e))
                        }
                    })
                }
                oldMember.roles.cache.forEach(async role => {
                    if (!newMember.roles.cache.has(role.id)) {
                        newMember.guild.channels.cache.find(x => x.name == "role-log").send({
                            embeds: [new Discord.EmbedBuilder().setDescription(`
${entry.executor} (\`${entry.executor.id}\`) tarafından ${newMember} (\`${newMember.id}\`) kişisine sağ tık ile ${role} (\`${role.id}\`) rolü alındı!
                            `)]
                        })
                        AuditRole.findOne({
                            user: newMember.id
                        }, async (err, res) => {
                            if (!res) {
                                let arr = []
                                arr.push({
                                    rol: role.id,
                                    mod: entry.executor.id,
                                    tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                        timeZone: "Asia/Istanbul"
                                    })),
                                    state: "Kaldırma"
                                })
                                let newData = new AuditRole({
                                    user: newMember.id,
                                    roller: arr
                                })
                                newData.save().catch(e => console.log(e))
                            } else {
                                res.roller.push({
                                    rol: role.id,
                                    mod: entry.executor.id,
                                    tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                        timeZone: "Asia/Istanbul"
                                    })),
                                    state: "Kaldırma"
                                })
                                res.save().catch(e => console.log(e))
                            }
                        })
                    }
                });
            })

        }
    }
}

module.exports = GuildMember;