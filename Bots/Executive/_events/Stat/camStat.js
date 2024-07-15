const { Event } = require("../../../../Global/Structures/Default.Events");
const { camJoinedAt, camUser, camGuild, camGuildChannel, camUserChannel } = require("../../../../Global/Settings/Schemas");

class CamStat extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });
    }

    async onLoad(newState, oldState) {
        if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

        if (!oldState.selfVideo && newState.selfVideo) {
            await camJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const joinedAtData = await camJoinedAt.findOne({ userID: oldState.id });
        await camUser.findOneAndUpdate({ userID: oldState.id }, { $set: { lastSeen: Date.now() } }, { upsert: true });

        if (!joinedAtData) {
            await camJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const data = Date.now() - joinedAtData?.date;
        if (oldState.selfVideo && !newState.selfVideo) {
            await saveDatas(oldState, oldState.channel, data);
            await camJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.selfVideo && newState.selfVideo) {
            await saveDatas(oldState, oldState.channel, data);
            await camJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        async function saveDatas(user, channel, data) {
            await camUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await camGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await camGuildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
            await camUserChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
        }
    }
}

module.exports = CamStat;
