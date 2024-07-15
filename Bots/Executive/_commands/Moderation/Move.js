
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Move extends Command {
    constructor(client) {
        super(client, {
            name: "move",
            description: "Belirlene kişiyi başka bir sese aktarımını sağlar.",
            usage: "move <ID> ",
            category: "Moderation",
            aliases: ["taşı"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        const memberToMove = message.mentions.members.first();
        if (!memberToMove) 
          return message.reply({ content: 'Lütfen taşınacak üyeyi etiketleyiniz!' });
    
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Önce sese giriniz.');
    
        const menu = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ChannelSelectMenuBuilder()
              .setCustomId('members')
              .setMaxValues(1)
              .setPlaceholder('Taşımak için bir kanal seçin')
              .addChannelTypes([Discord.ChannelType.GuildVoice])
          );
    
        await message.channel.send({ content: `${memberToMove} kullanıcısını taşımak istediğiniz kanalı seçin:`, components: [menu] });
    
        client.on('interactionCreate', async interaction => {
          if (interaction.customId === 'members') {
            const selectedChannelId = interaction.values[0];
    
            memberToMove.voice.setChannel(selectedChannelId)
              .then(() => {
                interaction.reply({ content: 'Üye taşındı!', ephemeral: true })
                  .catch(error => console.error(`İşlem yanıtlanamadı: ${error}`));
              })
              .catch(error => {
                console.error(`Üye taşınamadı: ${error}`);
                interaction.reply({ content: 'Üye taşınamadı!', ephemeral: true })
                  .catch(error => console.error(`İşlem yanıtlanamadı: ${error}`));
              });
          }
        });
    }
}

module.exports = Move