const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Permissions } = require('discord.js');

class EmojiCreate extends Command {
    constructor(client) {
        super(client, {
            name: "emoji",
            description: "Sunucu içerisinde emoji oluşturmanızı sağlar.",
            usage: "emoji <Emoji>",
            category: "Founders",
            aliases: ["emote"],
            enabled: true,
        });
    }

    async onRequest(client, message, args, embed, aris) {
        // İzin kontrolü
        if (!aris?.Founders.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !system.Bot.Roots.includes(message.member.id)) {
            return message.channel.send({ content: system.Replys.NoAuth }).sil(20);
        }

        // args kontrolü
        let emoji = args[0];
        let emojiName = args[1];
        if (!emoji) return message.reply({ content: `Bir Emoji belirtmelisin.` })
        if (!emojiName) return message.reply({ content: `Emojiye isim seçmelisin.` })

        const parseCustomEmoji = Discord.parseEmoji(emoji);
        if (parseCustomEmoji.id) {
            const emojiLink = `https://cdn.discordapp.com/emojis/${parseCustomEmoji.id}.${parseCustomEmoji.animated ? 'gif' : 'png'
                }`;
            const createEmoji = await message.guild.emojis.create({ attachment: emojiLink, name: emojiName || parseCustomEmoji.name });
            message.reply({
                content: `${createEmoji} emojisi sunucuya eklendi.`,
            });
        } else {
            message.reply({
                content: ':x: Emoji bulunamadı.',
                ephemeral: true,
            });
        }
    } catch(error) {
        console.error(error);
        message.channel.send({ content: "Bir hata oluştu! Lütfen `Positron` ile iletişime geçiniz." }).sil(20);
    }
}

module.exports = EmojiCreate;
