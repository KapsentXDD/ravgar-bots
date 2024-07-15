
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Allmute extends Command {
    constructor(client) {
        super(client, {
            name: "allmute",
            description: "Belirlenen sesteki kişileri susturur.",
            usage: "allmute <ID> ",
            category: "Moderation",
            aliases: ["herkesemute"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
        if (!channel) {
            message.reply({ embeds: [new Discord.EmbedBuilder()
                .setDescription(`Bir kanal ID girmeli ya da bir sesli kanalda bulunmalısın`)
            ] }).then((e) => setTimeout(() => { e.delete(); }, 10000));
            return;
        }

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('muteAll')
                .setLabel('Herkesi Sustur')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('unmuteAll')
                .setLabel('Herkesi Aç')
                .setStyle(Discord.ButtonStyle.Success)
        );

        message.reply({ content: `Sesli kanaldaki tüm üyeleri susturmak veya açmak istediğinizden emin misiniz?`, components: [row] }).then((msg) => {
            const filter = i => (i.customId === 'muteAll' || i.customId === 'unmuteAll') && i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 10000 });

            collector.on('collect', async (i) => {
                i.deferUpdate();
                if (i.customId === 'muteAll') {
                    channel.members.filter((x) => !x.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
                        .forEach((x, index) => {
                            client.wait(index * 1000);
                            x.voice.setMute(true);
                        });
                    await message.reply({ embeds: [new Discord.EmbedBuilder()
                        .setDescription(`🔇 \`${channel.name}\` kanalındaki tüm üyeler susturuldu!`)
                    ] });
                } else if (i.customId === 'unmuteAll') {
                    channel.members.filter((x) => !x.permissions.has(Discord.PermissionsBitField.Flags.Administrator))
                        .forEach((x, index) => {
                            client.wait(index * 1000);
                            x.voice.setMute(false);
                        });
                    await message.reply({ embeds: [new Discord.EmbedBuilder()
                        .setDescription(`🔊 \`${channel.name}\` kanalındaki tüm üyelerin susturulması kaldırıldı!`)
                    ] });
                }
            });
        });
    }
}

module.exports = Allmute