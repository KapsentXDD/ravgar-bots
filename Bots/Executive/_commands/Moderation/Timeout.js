
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Timeout extends Command {
    constructor(client) {
        super(client, {
            name: "timeout",
            description: "Sunucuda belirlenen kişiye zaman aşımı atar.",
            usage: "timeout <ID> ",
            category: "Moderation",
            aliases: ["zamanaşımı","to"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.getUser(args[0])
        if (!aris?.jailHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.vmuteHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.muteHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}timeout <<ID>>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.UpStaff }).sil(20)


        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("10m")
                    .setLabel("10 Dakika")
                    .setStyle(Discord.ButtonStyle.Primary),

                new Discord.ButtonBuilder()
                    .setCustomId("1h")
                    .setLabel("1 Saat")
                    .setStyle(Discord.ButtonStyle.Secondary),

                new Discord.ButtonBuilder()
                    .setCustomId("1g")
                    .setLabel("1 Gün")
                    .setStyle(Discord.ButtonStyle.Success),

                new Discord.ButtonBuilder()
                    .setCustomId("1hafta")
                    .setLabel("1 Hafta")
                    .setStyle(Discord.ButtonStyle.Danger)
            );


            const row1 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("atildi")
                    .setLabel("Timeout Atıldı")
                    .setEmoji("1226232108352147578")
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Danger),

            );

        const ravgar = new Discord.EmbedBuilder()
            .setDescription(`Merhaba ${message.author}! ${member} kişisinin timeout zamanını lütfen aşağıdaki butonlardan seçiniz!`);

        let msg = await message.channel.send({ embeds: [ravgar], components: [row] });

        var filter = button => button.user.id === message.member.id;

        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 });

        collector.on("collect", async (button) => {
            await button.deferUpdate();

            let embeds;

            if(button.customId === "10m") {
                embeds = new Discord.EmbedBuilder() 
                    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setDescription(`${message.author}, ${member} kişisinin **10 Dakikalık** zaman aşımına yolladı.`);
                member.timeout(10 * 60 * 1000);
                client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisine ${message.author} (\`${message.author.id}\`) tarafından **10 Dakikalık** timeout cezası uygulandı!`).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })
            } else if(button.customId === "1h") {
                embeds = new Discord.EmbedBuilder() 
                    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setDescription(`${message.author}, ${member} kişisinin **1 Saatlik** zaman aşımına yolladı.`);
                member.timeout(60 * 60 * 1000);
                client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisine ${message.author} (\`${message.author.id}\`) tarafından **1 Saatlik** timeout cezası uygulandı!`).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })
            } else if(button.customId === "1g") {
                embeds = new Discord.EmbedBuilder() 
                    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setDescription(`${message.author}, ${member} kişisinin **1 Günlük** zaman aşımına yolladı.`);
                member.timeout(24 * 60 * 60 * 1000);
                client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisine ${message.author} (\`${message.author.id}\`) tarafından **1 Günlük** timeout cezası uygulandı!`).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })
            } else if(button.customId === "1hafta") {
                embeds = new Discord.EmbedBuilder() 
                    .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true })})
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setDescription(`${message.author}, ${member} kişisinin **1 Haftalık** zaman aşımına yolladı.`);
                member.timeout(7 * 24 * 60 * 60 * 1000);
                client.channels.cache.find(x => x.name === "mute-log").send({ embeds: [embed.setDescription(`${member} (\`${member.id}\`) kişisine ${message.author} (\`${message.author.id}\`) tarafından **1 Haftalık** timeout cezası uygulandı!`).setFooter({ text: "Developed By Positron", iconURL: client.user.avatarURL({ dynamic: true }) }).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})] })
            }

            msg.edit({
                embeds: [embeds],
                components : [row1]
            });
        });

    }
}

module.exports = Timeout