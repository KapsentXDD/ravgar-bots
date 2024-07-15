const { Event } = require("../../../../Global/Structures/Default.Events");
const { User, Upstaff } = require("../../../../Global/Settings/Schemas");
class UserUpdate extends Event {
    constructor(client) {
        super(client, {
            name: "userUpdate",
            enabled: true,
        });
    }

    async onLoad(oldMember, newMember) {
        if (oldMember.bot || newMember.bot || oldMember.globalName === newMember.globalName) return;
        
        const guild = client.guilds.cache.get(system.Guild.ID);
        if (!guild) return;

        const aris = await ariscik.findOne({ guildID: system.Guild.ID });
        
        const member = guild.members.cache.get(oldMember.id);
        if (!member) return;
        
        const channel = client.channels.cache.find((x) => x.name == "tag-log");
        if (!channel) return;

        const guildTags = aris ? aris.tags : [];
        const hasOldTag = guildTags.some((tag) => oldMember.globalName.includes(tag));
        const hasNewTag = guildTags.some((tag) => newMember.globalName.includes(tag));

        if (hasOldTag && !hasNewTag) {
            const embeds = new Discord.EmbedBuilder()
                .setDescription(`
                    ${member.toString()} isimli eski taglımız, tagımızı <t:${Math.floor(Date.now() / 1000)}:R> bıraktı.
                `);

            channel.send({ content: `${member.toString()} [\`${member.id}\`]`, embeds: [embeds] });

            if (!member.roles.cache.has(aris.vipRole) && !member.roles.cache.has(aris.boosterRole)) return member.roles.set(aris.unregisterRoles);
        } else if (!hasOldTag && hasNewTag) {
            member.roles.add(aris.tagRole);

            const embeds = new Discord.EmbedBuilder()
            
                .setDescription(`
                    ${member.toString()} isimli üye ailemize katıldı, tagımızı <t:${Math.floor(Date.now() / 1000)}:R> aldı.
                `);

            channel.send({ content: `${member.toString()} [\`${member.id}\`]`, embeds: [embeds] });
        }
    }
}

module.exports = UserUpdate;
