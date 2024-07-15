
const { Command } = require("../../../../Global/Structures/Default.Commands");
class HELP extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Sunucu içerisi bot komutlarını gösterir.",
            usage: "help",
            category: "Misc",
            aliases: ["yardım", "y"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {
        client.on("interactionCreate", async(interaction) => {
            let founders = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Founders").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
            let misc = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Misc").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
            let mod = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Moderation").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
            let register = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Register").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
            let stat = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Stat").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
            let diger = `\n${client.commands.filter(cmd => cmd.description && cmd.category && cmd.category === "Stagram").map(cmd => `__**${system.Bot.Prefixs[0]}${cmd.name}**__ - \` ${cmd.description} \``).join("\n")}`
    
            if (interaction.customId == "yardimpaneli") {
                if (interaction.values[0] == "yonetici") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${founders}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "general") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${misc}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "moderasyon") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${mod}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "register") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${register}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "stat") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${stat}`)], ephemeral: true
                    })
                }
                if (interaction.values[0] == "diger") {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder().setDescription(`${diger}`)], ephemeral: true
                    })
                }
            }
        })
    }

    async onRequest(client, message, args, embed, aris) {
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('yardimpaneli')
                    .setPlaceholder('Yardım Paneli')
                    .addOptions(
                        { label: 'Yönetici Komutları', value: 'yonetici', emoji: { "id": "1183601410890272808" } },
                        { label: 'Genel Komutlar', value: 'general', emoji: { "id": "1183601410890272808" } },
                        { label: 'Moderasyon Komutları', value: 'moderasyon', emoji: { "id": "1183601410890272808" } },
                        { label: 'Register Komutları', value: 'register', emoji: { "id": "1183601410890272808" } },
                        { label: 'Stat Komutları', value: 'stat', emoji: { "id": "1183601410890272808" } },
                        { label: 'Diğer Komutlar', value: 'diger', emoji: { "id": "1183601410890272808" } },
                    ),
            );
        message.channel.send({ content: `Aşağıdaki menü yardımı ile komutların detayını öğrenebilirsin!`, components: [row] });
    }
}

module.exports = HELP
