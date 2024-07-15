const { Client, ApplicationCommandType, MessageEmbed, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "banner",
    description: "Bir kullanıcının bannerına bak!",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'kişi',
            description: 'Bannerını görmek istediğin üyeyi etiketle.',
            type: 6,
            required: true
        },
    ],
    onRequest: async (client, interaction, aris) => {
        try {
            const user = interaction.options.get('kişi').user;
            const response = await axios.get(`https://discord.com/api/v9/users/${user.id}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            let bannerurl;
            if (!response.data.banner) {
                return interaction.reply({ content: `Bu kullanıcının bannerı bulunmamaktadır.`, ephemeral: true });
            } else if (response.data.banner.startsWith('a_')) {
                bannerurl = `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`;
            } else {
                bannerurl = `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`;
            }

            interaction.reply({ content: `> **${user.tag}**`, files: [{ attachment: `${bannerurl}` }], ephemeral: true });
        } catch (error) {
            console.error("Banner komutu sırasında bir hata oluştu:", error);
            interaction.reply({ content: "Komut çalışırken bir hata oluştu.", ephemeral: true });
        }
    }
}
