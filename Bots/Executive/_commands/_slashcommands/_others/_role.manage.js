const { Client, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "rol",
    description: "Bu bir rol ver/al komutudur.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'ver',
            description: 'Bununla sadece rol verebilirsin.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Verilecek rolü belirtmelisin.',
                    type: 8,
                    required: true
                },
                {
                    name: 'kişi',
                    description: 'Verilecek kişiyi belirtmelisin.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'al',
            description: 'Bununla sadece rolü alabilirsin.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Alınacak rolü belirtmelisin.',
                    type: 8,
                    required: true
                },
                {
                    name: 'kişi',
                    description: 'Alınacak kişiyi belirtmelisin.',
                    type: 6,
                    required: true
                }
            ]
        }
    ],

    onRequest: async (client, interaction, aris) => {
        const kullaniciAdi = interaction.member.displayName;
        const userHasAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
    
        if (!userHasAdmin) {
            return interaction.reply({ content: "**Bu Komutu Kullanmak İçin Yetersiz Yetki**", ephemeral: true });
        }
    
        try {
            if (interaction.options._subcommand === "ver") {
                const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
                const role = interaction.options.get('rol').role;
    
                if (member.roles.cache.has(role.id)) {
                    return interaction.reply({ content: "Kullanıcı zaten bu role sahip.", ephemeral: true });
                }
    
                await member.roles.add(role.id);
                const embed = new Discord.EmbedBuilder()
                    .setDescription(`Merhaba! "${kullaniciAdi}" <t:${Math.floor(Date.now() / 1000)}:R> Rol Verme İşlemi Başarılı!\n\` Verilen Rol \` ${role}\n\` Verilen Kişi \` ${member}`)
    
                return interaction.reply({ embeds: [embed] });
            } else if (interaction.options._subcommand === "al") {
                const member = interaction.guild.members.cache.get(interaction.options.get('kişi').value);
                const role = interaction.options.get('rol').role;
    
                if (!member.roles.cache.has(role.id)) {
                    return interaction.reply({ content: "Kullanıcı zaten bu role sahip değil.", ephemeral: true });
                }
    
                await member.roles.remove(role.id);
                const embed = new Discord.EmbedBuilder()
                    .setDescription(`Merhaba! "${kullaniciAdi}" <t:${Math.floor(Date.now() / 1000)}:R> Rol Alma İşlemi Başarılı!\n\` Alınan Rol \` ${role}\n\` Alınan Kişi \` ${member}`)
    
                return interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error("Komut işlenirken bir hata oluştu:", error);
            return interaction.reply({ content: "Komut işlenirken bir hata oluştu.", ephemeral: true });
        }
    }
}