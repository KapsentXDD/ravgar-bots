const { Event } = require("../../../../Global/Structures/Default.Events");
const { Invites, Upstaff, User, LeftedRole } = require("../../../../Global/Settings/Schemas")
class GuildMemberRemove extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberRemove",
            enabled: true,
        });
    }

    async onLoad(member) {
        if (member.guild.id !== system.Guild.ID) return;
        const aris = await ariscik.findOne({ guildID: member.guild.id })
        let inviteChannel = client.channels.cache.get(aris?.inviteLog);
        const inviteMemberData = await User.findOne({ userID: member.user.id }) || [];
        if (!inviteMemberData.Inviter) {
            if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: ${member.guild.vanityURLCode ? 'Özel URL' : `Davetçi Bulunamadı!`}` });
          } else if (inviteMemberData.Inviter.inviter === member.guild.id) {
            await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: member.guild.id }, { $inc: { total: -1 } }, { upsert: true });
            const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
            if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: \`Sunucu Özel URL\` \`(${inviterData ? inviterData.total : 0})\`` });
          } else {
            if (Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7) {
              const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
              const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
              if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** \`(${inviterData ? inviterData.total : 0})\`` })
            } else {
              const inviter = await client.users.fetch(inviteMemberData.Inviter.inviter);
              await Invites.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
              const inviterData = await Invites.findOne({ guildID: member.guild.id, userID: member.guild.id });
              if (inviteChannel) inviteChannel.send({ content: `**${member.user.tag}** sunucumuzdan ayrıldı! Davet eden: **${inviter.tag}** \`(${inviterData ? inviterData.total : 0})\`` });
            }
          }
          const roleIdsToSave = ["1218311175570325595", "1218311188572799067", "1218311201868742868", "1218311155530076222"];

          // Üyenin tüm rollerini alın
          const memberRoles = member.roles.cache.map(role => role.id);
    
          // En az bir rol kaydedilmeye değer mi diye kontrol edin
          const hasAnyRoleToSave = memberRoles.some(roleId => roleIdsToSave.includes(roleId));
    
          // Kaydedilmeye değer bir rol varsa işlemi devam ettir
          if (hasAnyRoleToSave) {
            // Kaydedilecek rolleri filtreleyin
            const rolesToSave = memberRoles.filter(roleId => roleIdsToSave.includes(roleId));
    
            // Üyenin rollerini bir diziye kaydet
            const rolesArray = [...memberRoles];

            await LeftedRole.findOneAndUpdate(
              { _id: member.id },
              { _roles: rolesArray },
              { upsert: true }
            );
    
            inviteChannel.send({ content: `**${member.user.tag}** kullanıcısının kaydedilmeye değer rolleri başarıyla kaydedildi.`});
          } else {
            inviteChannel.send({ content: `**${member.user.tag}** kullanıcısı kaydedilmeye değer bir role sahip değil.`});
          }
        } catch (error) {
          console.error("Rol kaydetme işlemi sırasında bir hata oluştu:", error);
        }
    }

module.exports = GuildMemberRemove;

