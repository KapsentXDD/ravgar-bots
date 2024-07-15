const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas");
const axios = require('axios');

class Globalname extends Command {
    constructor(client) {
        super(client, {
            name: "globalname",
            description: "Sunucu içerisinde bir üyenin diğer sunuculardaki bilgilerini gösterir.",
            usage: "globalname <ID>",
            category: "Register",
            aliases: ["gn","globalname", "globalisim", "globalbilgi", "globalinfo", "globalbilgiler", "globalbilgileri"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.Permissions.BitFieldFlags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20);
        
        const userID = args[0].replace(/[\\<>@!]/g, '');
        const apiKey = 'test';
        const apiUrl = `http://89.150.148.119:10000/user/${userID}`;

        try {
            const response = await axios.get(apiUrl);
            const guildsData = response.data.Guilds;
            let displayNames = '';

            for (const guild of guildsData) {
                const displayName = guild.displayName;
                const guildName = guild.GuildName;
                displayNames += `\`${guildName}\`: **${displayName}**\n`;
            }
            const user = message.mentions.users.first() || message.author;
            const embed = new Discord.EmbedBuilder()
            .setTitle(`${user.username}'nin Bilinen İsimleri`)
            .setDescription(displayNames)
            .setColor("Random");

        await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error);
            await message.reply({ content: 'API\'den veri alınırken bir hata oluştu.' });
        }
    }
}

module.exports = Globalname;
