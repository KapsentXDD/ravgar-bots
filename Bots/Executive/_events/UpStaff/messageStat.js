const { Event } = require("../../../../Global/Structures/Default.Events");
const { Upstaff } = require("../../../../Global/Settings/Schemas")
const Ariscik = require("../../../../Global/Settings/Ariscik");
const nums = new Map();
class UpStaffMessage extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }

    async onLoad(message) {
        const aris = await Ariscik.findOne({ guildID: message.guild.id })
        if (aris?.staffRanks.length < 0) return;
        if (message.member && aris?.staffMode && aris?.registerHammer.some((x) => message.member.roles.cache.has(x)) && !aris?.bannedChannels.some((x) => message.channel.id === x)) {
            const num = nums.get(message.author.id);
            if (num && num % aris?.messageCount === 0) {
                nums.set(message.author.id, num + 1);
                await Upstaff.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: aris?.messageCoin, messageStat: 1 } }, { upsert: true });
                const coinData = await Upstaff.findOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                });
                if (coinData && aris?.staffRanks.some((x) => coinData.coin === x.coin)) {
                    const newRank = aris?.staffRanks.filter((x) => coinData.coin >= x.coin).last();
                    message.member.roles.add(newRank.role);
                    const oldRoles = aris?.staffRanks.filter((x) => coinData.coin < x.coin && message.member.hasRole(x.role));
                    oldRoles.forEach((x) => x.role.forEach((r) => message.member.roles.remove(r)));
                    message.guild.findChannel("rank-log").send({
                        content:
`:tada: ${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map((x) => `${message.guild.roles.cache.get(x).name}`).join(", ") : `${message.guild.roles.cache.get(newRank.role).name}`} rolü verildi!`
                    });
                }
            } else nums.set(message.author.id, num ? num + 1 : 1);

        }
    }
}

module.exports = UpStaffMessage;