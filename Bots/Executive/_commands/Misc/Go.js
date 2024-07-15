const { Command } = require("../../../../Global/Structures/Default.Commands");
const moment = require("moment");
moment.locale("tr");
class Go extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            description: "Sunucu içerisi bir kişinin diğer kişinin yanına gitmesini sağlar.",
            usage: "git <ID>",
            category: "Misc",
            aliases: ["git"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (!message.member.voice.channel) {
            return message.reply({ content: "Bir ses kanalında olmalısın!" });
        }
        if (!member) {
            return message.reply({ content: "Bir üye etiketle ve tekrardan dene!" });
        }
        if (!member.voice.channel) {
            return message.reply({ content: "Bu kullanıcı herhangi bir ses kanalında bulunmuyor!" });
        }
        if (message.member.voice.channel === member.voice.channel) {
            return message.reply({ content: "Zaten aynı kanaldasınız!" });
        }

        const row = new Discord.ActionRowBuilder()
            .addComponents(

                new Discord.ButtonBuilder()
                    .setCustomId("onay")
                    .setLabel("Kabul Et")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setEmoji(`${message.guild.findEmoji(system.Emojis.Onay).id}`),

                new Discord.ButtonBuilder()
                    .setCustomId("red")
                    .setLabel("Reddet")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji(`${message.guild.findEmoji(system.Emojis.Iptal).id}`),
            );


        const row2 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("onayy")
                    .setLabel("İşlem Başarılı")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(true),
            );

        const row3 = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("redd")
                    .setLabel("İşlem Başarısız")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );

        if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
            message.member.voice.setChannel(member.voice.channel.id)
            message.react(message.guild.findEmoji(system.Emojis.Onay))
            message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author}, ${member} kişisini yanınıza gittiniz.`)] });
            const log = embed
                .setDescription(`
            Bir Transport işlemi gerçekleşti.
        
            Odaya Giden Kullanıcı: ${member} - \`${member.id}\`
            Odasına Gidilen Yetkili: ${message.author} - \`${message.author.id}\`
            `)
                .setFooter({ text: `${moment(Date.now()).format("LLL")}` })
            client.channels.cache.find(x => x.name == "voice-log").wsend({ embeds: [log] });
        } else {

            let ravgar = new EmbedBuilder()
                .setDescription(`${member}, ${message.author} \`${member.voice.channel.name}\` odasına gelmek istiyor. Kabul ediyor musun?`)
                .setFooter({ text: `30 saniye içerisinde işlem iptal edilecektir.` })
                .setAuthor({ name: member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })

            let msg = await message.channel.send({ content: `${member}`, embeds: [ravgar], components: [row] })

            var filter = button => button.user.id === member.user.id;

            let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

            collector.on("collect", async (button) => {

                if (button.customId === "onay") {
                    await button.deferUpdate();

                    const embeds = new EmbedBuilder()
                        .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
                        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${message.author}, ${member} kişisinin yanına başarıyla gittiniz.`)

                    message.member.voice.setChannel(member.voice.channel.id)

                    msg.edit({
                        embeds: [embeds],
                        components: [row2]
                    })

                }

                if (button.customId === "red") {
                    await button.deferUpdate();

                    const embedss = new EmbedBuilder()
                        .setAuthor({ name: member.displayName, iconURL: member.user.avatarURL({ dynamic: true }) })
                        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
                        .setTimestamp()
                        .setDescription(`${message.author}, ${member} yanına gitme işlemi iptal edildi.`)

                    msg.edit({
                        embeds: [embedss],
                        components: [row3]
                    })
                }
            });

        }

    }
}

module.exports = Go
