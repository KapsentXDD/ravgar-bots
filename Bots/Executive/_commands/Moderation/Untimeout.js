
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Untimeout extends Command {
    constructor(client) {
        super(client, {
            name: "untimeout",
            description: "Sunucuda belirlenen kişiye atılan zaman aşımını kaldırır.",
            usage: "untimeout <ID> ",
            category: "Moderation",
            aliases: ["zamanaşımıkaldır","uto"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
        if (!aris?.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.vmuteHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}untimeout <<ID>>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.UpStaff }).sil(20)


        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("kaldır")
                    .setLabel("Timeout Kaldır")
                    .setStyle(Discord.ButtonStyle.Success),
            );


            const row1 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("atildi")
                    .setLabel("Timeout Kaldırıldı")
                    .setEmoji("1226232108352147578")
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Danger),

            );

        const ravgar = new Discord.EmbedBuilder()
            .setDescription(`Merhaba ${message.author}! ${member} kişisinin timeoutunu kaldırmak için aşağıdaki butonu kullanabilirsin!`);

        let msg = await message.channel.send({ embeds: [ravgar], components: [row] });

        var filter = button => button.user.id === message.member.id;

        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (button) => {
            await button.deferUpdate();

            let embeds;

            if(button.customId === "kaldır") {
                embeds = new Discord.EmbedBuilder() 
                    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setDescription(`${message.author}, ${member} kişisinin zaman aşımı başarıyla kaldırıldı.`);
                member.timeout(null);
                client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisinin ${message.author} (\`${message.author.id}\`) tarafından timeout cezası kaldırıldı!`).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })

            msg.edit({
                embeds: [embeds],
                components : [row1]
            });
        }});
    }
}

module.exports = Untimeout