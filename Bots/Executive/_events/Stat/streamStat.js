const { Event } = require("../../../../Global/Structures/Default.Events");
const { streamJoinedAt, streamUser, streamGuild, streamGuildChannel, streamUserChannel } = require("../../../../Global/Settings/Schemas");

class StreamStat extends Event {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate",
            enabled: true,
        });
    }

    async onLoad(newState, oldState) {
        if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

        if (!oldState.streaming && newState.streaming) {
            await streamJoinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const joinedAtData = await streamJoinedAt.findOne({ userID: oldState.id });
        await streamUser.findOneAndUpdate({ userID: oldState.id }, { $set: { lastSeen: Date.now() } }, { upsert: true });

        if (!joinedAtData) {
            await streamJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        const data = Date.now() - joinedAtData?.date;
        if (oldState.streaming && !newState.streaming) {
            await saveDatas(oldState, oldState.channel, data);
            await streamJoinedAt.deleteOne({ userID: oldState.id });
        } else if (oldState.streaming && newState.streaming) {
            await saveDatas(oldState, oldState.channel, data);
            await streamJoinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
        }

        async function saveDatas(user, channel, data) {
            await streamUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await streamGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, weeklyStat: data, } }, { upsert: true });
            await streamGuildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
            await streamUserChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
        }
    }
}

module.exports = StreamStat;
