const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Excuse } = require("../../../../Global/Settings/Schemas");

class EExcuse extends Command {
    constructor(client) {
        super(client, {
            name: "mazeret",
            description: "Sunucu içerisinde yetkili bir kişinin mazeret belirlemesini sağlar.",
            usage: "Mazeret <Sebep>",
            category: "Stat",
            aliases: ["mazeret", "excuse", "ex"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (aris?.staffMode == false) return message.react(message.guild.findEmoji(system.Emojis.Iptal));
        if (aris?.staffRanks < 0) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} verilerim eksik! Lütfen \`Positron Kurucuları\` ile iletişime geçin!` }).sil(80);
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoAuth}` }).sil(10);
        if (!aris?.tags.some(a => message.member.displayName.includes(a)) && !aris?.tags.some(a => message.member.username.includes(a))) return message.channel.send({ content: `${message.guild.findEmoji(system.Emojis.Iptal)} ${message.author} ${system.Replys.NoTag}` }).sil(20)
        // Kullanıcının belirttiği mazeret metnini al
        const excuseText = args.join(" ");
        if (!excuseText) return message.channel.send("Lütfen bir mazeret belirtin.");

        // Kullanıcının daha önce mazeret belirtip belirtmediğini kontrol et
        const existingExcuse = await Excuse.findOne({ authorID: message.author.id, guildID: message.guild.id });
        if (existingExcuse) return message.channel.send("Zaten bir mazaretiniz bulunmaktadır.");

        // Mazereti veritabanına kaydet
        const newExcuse = new Excuse({
            excuse: excuseText,
            authorID: message.author.id,
            guildID: message.guild.id,
            date: new Date().setHours(0, 0, 0, 0)
        });

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === "mazeret-log");
        if (!logChannel) return message.channel.send("Mazeret log kanalı bulunamadı. Lütfen yetkiliye bildirin.");

        // Embed oluştur
        const embeds = new Discord.EmbedBuilder()
            .setDescription(`
                ${member} Adlı Yetkilinin Toplantıya Katılmama Mazereti;

                \` Yetkili : \` ${member} [\`${member.id}\`]
                \` Mazeret Bildirilme Tarihi : \` **${newExcuse.date.toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric"})}**
                \` Yetkili Mazareti : \` \` ${excuseText} \`
            `);

        // Onayla ve Reddet düğmelerini içeren bir action row oluştur
        const actionRow = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("onay")
                    .setLabel("Onayla")
                    .setStyle(Discord.ButtonStyle.Success), // Yetkili rolüne sahip olanlar butonu tıklayabilir
                new Discord.ButtonBuilder()
                    .setCustomId("red")
                    .setLabel("Reddet")
                    .setStyle(Discord.ButtonStyle.Danger)
            );

        // Embed ve Action Row'u log kanalına gönder
        const mazeretMessage = await logChannel.send({ embeds: [embeds], components: [actionRow] });

        // Buton
        const collector = mazeretMessage.createMessageComponentCollector();

        collector.on("collect", async (interaction) => {
            if (interaction.member.id === message.author.id) { // Eğer etkileşim yapan kullanıcı mesajı gönderen kullanıcı ise
                await message.reply("Kendi Mazeretini Onaylayamazsın!")
                return;
            }

            if (interaction.customId === "onay") {
                await newExcuse.save();
                await interaction.update({ content: "Mazeret onaylandı.", components: [] });
            } else if (interaction.customId === "red") {
                await interaction.update({ content: "Mazeret reddedildi.", components: [] });
            }
        });

        collector.on("end", () => {
            mazeretMessage.edit({ components: [] });
        });
        message.channel.send(`${member} Mazaret başarıyla gönderildi.`);
    }
}

module.exports = EExcuse;
