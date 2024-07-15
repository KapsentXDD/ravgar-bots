const { Client, ApplicationCommandType, EmbedBuilder,StringSelectMenuBuilder, SelectMenuBuilder} = require("discord.js");
const { Event } = require("../../../../Global/Structures/Default.Events");
const { User, VMute, Mute, Jail, Invites, Upstaff } = require("../../../../Global/Settings/Schemas")
class GuildMemberAdd extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            enabled: true,
        });
    }

    async onLoad(member) {
        if (member.guild.id !== system.Guild.ID) return;
        const aris = await ariscik.findOne({ guildID: member.guild.id })
        const users = await User.findOne({ guildID: member.guild.id })
        const vmutes = await VMute.findOne({ userID: member.id })
        const mutes = await Mute.findOne({ userID: member.id })
        const jails = await Jail.findOne({ userID: member.id })
        if (users?.Name && users?.Age && users?.Gender && aris?.tagMode != true) {
            member.guild.channels.cache.get(aris?.welcomeChannel).send({ content: `${member} (\`${member.id}\`) üyesi zaten kayıtlı olduğu için \`${aris?.tags.some(x => member.user.username.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} ${users?.Name} | ${users?.Age}\` olarak \`${users?.Gender}\` olarak kayıt edildi!` })
            if (users?.Gender == "Man") return member.roles.add(aris?.ManRoles).catch(err => { })
            if (users?.Gender == "Woman") return member.roles.add(aris?.WomanRoles).catch(err => { })
            await member.setNickname(`${aris?.tags.some(x => member.user.username.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} ${users?.Name} | ${users?.Age}`);
        } else if (Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7) {
            member.setRoles(aris?.suspectRole).catch(err => { })
            if (vmutes) member.roles.add(aris?.vmutedRole).catch(err => { })
            if (mutes) member.roles.add(aris?.mutedRole).catch(err => { })
            member.guild.channels.cache.get(aris?.welcomeChannel).send({ content: `${member} (\`${member.id}\`) üyesi aramıza katıldı fakat hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}:R> oluşturulduğu için **Şüpheli** olarak işaretlendi!` })
            return member.guild.findChannel("şüpheli-log").send({ content: `${member} (\`${member.id}\`) üyesinin hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}:R> oluşturulduğu için **Şüpheli** olarak işaretlendi!` })
        } else if (jails) {
            member.setRoles(aris?.jailedRole)
            if (vmutes) member.roles.add(aris?.vmutedRole).catch(err => { })
            if (mutes) member.roles.add(aris?.mutedRole).catch(err => { })
            member.guild.channels.cache.get(aris?.welcomeChannel).send({ content: `${member} (\`${member.id}\`) üyesi aramıza katıldı fakat aktif bir cezası olduğu için **Cezalı** olarak işaretlendi!` })
            return member.guild.findChannel("jail-log").send({ content: `${member} (\`${member.id}\`) üyesi sunucuya katıldı fakat aktif cezası bulunduğu için **Cezalı** olarak işaretlendi!` })
        } else if (aris?.bannedTags.some(x => member.user.tag.includes(x))) {
            member.setRoles(aris?.bannedTagRole);
            if (vmutes) member.roles.add(aris?.vmutedRole).catch(err => { })
            if (mutes) member.roles.add(aris?.mutedRole).catch(err => { })
            return member.guild.channels.cache.get(aris?.welcomeChannel).send({ content: `${member} (\`${member.id}\`) isimli kişi sunucumuza katıldı, ismininde \`Yasaklı Tag\` bulundurduğu için **Cezalı** olarak belirlendi!` });
        };

        await member.roles.add(aris?.unregisterRoles).catch(err => { })
        await member.setNickname(`${aris?.tags.some(x => member.user.username.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} İsim | Yaş`);
        let invitelog = member.guild.channels.cache.get(aris?.inviteLog)
        let welcomelog = member.guild.channels.cache.get(aris?.welcomeChannel)
        const guildInvites = client.Invites.get(member.guild.id) || new Discord.Collection()
        const invites = await member.guild.invites.fetch();
        const invite = invites.find((inv) => guildInvites.has(inv.code) && inv.uses > guildInvites.get(inv.code).uses) || guildInvites.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
        const cacheInvites = new Discord.Collection();
        invites.map((inv) => { cacheInvites.set(inv.code, { code: inv.code, uses: inv.uses, inviter: inv.inviter }); });
        client.Invites.set(member.guild.id, cacheInvites);
        let davetci;
        if (invite == null) {
            if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! ${member.guild.vanityURLCode ? 'Özel URL' : `Davetçi Bulunamadı!`}` })
            davetci = `${member.guild.vanityURLCode ? 'Özel URL' : ``}`
        } else if (invite === undefined) {
            if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! ${member.guild.vanityURLCode ? 'Özel URL' : `Davetçi Bulunamadı!`}` })
            davetci = `${member.guild.vanityURLCode ? 'Özel URL' : ``}`
        } else if (!invite) {
            if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! ${member.guild.vanityURLCode ? 'Özel URL' : `Davetçi Bulunamadı!`}` })
            davetci = `${member.guild.vanityURLCode ? 'Özel URL' : ``}`
        } else if (invite === member.guild.vanityURLCode) {
            await User.findOneAndUpdate({ userID: member.user.id }, { $set: { Inviter: { inviter: member.guild.id, date: Date.now() } } }, { upsert: true });
            await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: 1 } }, { upsert: true });
            const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
            if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! Davet eden **ÖZEL URL**! \`(${inviterData ? inviterData.total : 0})\`` })
            davetci = `**ÖZEL URL**`
        } else {
            await User.findOneAndUpdate({ userID: member.user.id }, { $set: { Inviter: { inviter: invite.inviter.id, date: Date.now() } } }, { upsert: true });
            if (Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7) {
                await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { fake: 1, regular: 1 } }, { upsert: true });
                const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
                if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! Davet eden **${invite.inviter.tag}**! \`(${inviterData ? inviterData.total : 0})\`` })
                davetci = `${invite.inviter}`
            } else {
                await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
                const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
                if (invitelog) invitelog.send({ content: `${member} kişisi katıldı! Davet eden **${invite.inviter.tag}**! \`(${inviterData ? inviterData.total : 0})\`` })
                davetci = `${invite.inviter}`
            }
            const upData = await Upstaff.findOne({ userID: invite.inviter.id })
            if (upData?.GorevDurum == true && upData?.GorevTip == "Invite") {
                await Upstaff.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { YapilanGorev: 1 } }, { upsert: true }).exec();
                if (upData?.YapilanGorev >= upData?.GorevAdet) {
                    let kazanilan = getRandomInt(50, 100)
                    member.guild.channels.cache.find(x => x.name == "task-log").send({
                        content: `${invite.inviter} kişisi ${upData?.Gorev ? upData?.Gorev : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
                    })
                    await Upstaff.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $set: { Gorev: ``, GorevAdet: ``, GorevTip: ``, GorevDurum: false } }, { upsert: true }).exec();
                    await Upstaff.updateOne({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { coin: kazanilan, ToplamGorev: 1, ToplamPuan: kazanilan } }, { upsert: true });
                }
            }
            await Upstaff.updateOne({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { coin: aris?.inviteCoin, inviteStat: 1 } }, { upsert: true });
        }

        if (welcomelog) {
            const welcomeEmbed = new Discord.EmbedBuilder()
              .setDescription(`
${member} (\`${member.id}\`) **${member.guild.name}** Sunucumuza Hoşgeldin! :tada:
          
Sunucumuza ${davetci} sayesinde katıldın! seninle birlikte ailemiz ${global.numberEmojis(member.guild.memberCount)} kişi oldu!

Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}:R> tarihinde oluşturulmuş!
          
Unutma, sunucu içerisisindeki cezalandırma işlemleri kuralları okuduğunun varsayılarak yapılacaktır!
              `);
          
            welcomelog.send({
                content: `${aris?.regMent ? aris.registerHammer.slice(0, 3).map(id => `<@&${id}>`) : ""}`,
                embeds: [welcomeEmbed]
            });
          }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    }}
module.exports = GuildMemberAdd;