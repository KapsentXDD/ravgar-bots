
const { Command } = require("../../../../Global/Structures/Default.Commands");
class adminList extends Command {
    constructor(client) {
        super(client, {
            name: "adminlist",
            description: "Sunucu içerisindeki admin izni açık rolleri görüntüler!",
            usage: "adminlist",
            category: "Founders",
            aliases: ["admlist","alist","yöneticilist"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        
        var list = [] 
        var i = 1
        await message.guild.members.cache.forEach(async m => {
            if(!m.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return 
            await list.push(`<@${m.id}>`)
        });

        message.react(message.guild.findEmoji(system.Emojis.Onay))
        const listEmbed = new Discord.EmbedBuilder()
.setAuthor({ name: `${message.guild.name} (Yönetici Listesi)`,iconURL: message.guild.iconURL({ dynamic: true }) })
            .setDescription(`Aşağıda Yönetici Yetkisine Sahip Kullanıcılar Ve Botlar Listelenmektedir. \n\n${list.map(list => `\`[${i++}.]\` ${list}`).join("\n")}`) 
        return message.reply({ embeds: [listEmbed]})


    }
}

module.exports = adminList

