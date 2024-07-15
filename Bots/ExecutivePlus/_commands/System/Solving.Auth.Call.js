const { Command } = require("../../../../Global/Structures/Default.Commands");

class SolvingAuthCall extends Command {
    constructor(client) {
        super(client, {
            name: "test",
            description: "-",
            usage: "-",
            category: "Guild",
            aliases: ["sorunçözücüçağırbuton","sççb"],
            enabled: true,
        });

        // Kullanıcıların son butona basma zamanlarını saklamak için bir harita (map) oluşturuyoruz
        this.lastButtonClicks = new Map();
    }

    async onLoad(client) {
        // Optional: Burada gerekiyorsa herhangi bir ön yükleme işlemi yapabilirsiniz.
    }

    async onRequest(client, message, args, embed, aris) {
        // Buton oluşturma
        let solving = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("solve")
                .setLabel("Sorun Çözücü Çağır")
                .setStyle("Danger"),
        );

        // Mesaj gönderme
        let authMsg = await message.channel.send({ content: `Merhaba! Aşağıdaki butona basarak aktif olan sorun çözücülerini çağırabilirsiniz.`, components: [solving] });

        // Butona basılmasını beklemek için collector oluşturma
        const filter = (interaction) => interaction.customId === 'solve' && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter });

        // Butona basıldığında
        collector.on('collect', async (interaction) => {
            const userId = interaction.user.id;

            // Kullanıcının son butona basma zamanını kontrol etmek için cooldown süresini al
            const cooldown = this.lastButtonClicks.get(userId) || 0;

            // Eğer son butona basma zamanı ile şu anki zaman arasında cooldown süresinden az bir süre varsa, işlemi iptal et
            if (Date.now() - cooldown < 300000) {
                await interaction.reply({ content: `Bu butona tekrar basmak için ${Math.ceil((300000 - (Date.now() - cooldown)) / 1000)} saniye beklemelisiniz.`, ephemeral: true });
                return;
            }

            // Butonun son basılma zamanını güncelle
            this.lastButtonClicks.set(userId, Date.now());

            // Burada belirli bir role sahip kullanıcıları etiketlemek için gerekli işlemleri yapabilirsiniz.
            // Örneğin:
            const role = message.guild.roles.cache.find(role => role.name === 'Sorun Çözücü');
            if (!role) return console.log('Belirli rol bulunamadı.');
            const membersWithRole = message.guild.members.cache.filter(member => member.roles.cache.some(r => r.id === role.id));
            const taggedMembers = membersWithRole.map(member => `<@${member.user.id}>`);
            
            // Etiketlenmiş üyeleri mesajla gönderme
            await message.channel.send(`Sorun çözücüler: ${taggedMembers.join(', ')}`).sil(350);
        });
    }
}

module.exports = SolvingAuthCall;
