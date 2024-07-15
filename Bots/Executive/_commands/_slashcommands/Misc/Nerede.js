const { Client, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "nerede",
    description: "Bir Kullanıcının Nerde Olduğuna Bak!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'kişi',
            description: 'Nerde Olduğunu Görmek İstediğin Kişi',
            type: 6,
            required: true
        },
    ],
    onRequest: async (client, interaction, aris) => {
        const kişi = interaction.options.getUser("kişi");
        const member = interaction.guild.members.cache.get(kişi.id);

        if (!member) {
            return interaction.reply("Kullanıcı sunucuda bulunamadı!");
        }

        const lastMessage = member.lastMessage; 
        const lastVoiceChannel = member.voice.channel; 

        const embed = new Discord.EmbedBuilder()
            .setThumbnail(kişi.displayAvatarURL()); 
        if (lastVoiceChannel) {
            const channelMembers = lastVoiceChannel.members.array();
            if (channelMembers.length > 0) {
                const memberList = channelMembers.slice(0, 10).map(member => member.toString()).join("\n\` - \`");
            embed.setDescription(`**Ses Kanalı**\n<#${lastVoiceChannel.id}>\n\n**Sesteki Kullanıcılar**\n${memberList}`);
        } else {
            embed.setDescription("**Kullanıcı Şuanda Ses Kanallarında Bulunmuyor**");
        }

        await interaction.reply({ embeds: [embed] , ephemeral: true });
    }
}
}
