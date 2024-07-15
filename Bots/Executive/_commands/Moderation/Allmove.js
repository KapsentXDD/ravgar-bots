
const { Command } = require("../../../../Global/Structures/Default.Commands");
class Allmove extends Command {
    constructor(client) {
        super(client, {
            name: "allmove",
            description: "Sunucuda belirlenen sesteki kişilerin başka bir sese aktarımını sağlar.",
            usage: "allmove <ID> ",
            category: "Moderation",
            aliases: ["herkesitaşı", "alltaşı"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
    
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Önce sese girmen gerek.');
    
        if (voiceChannel && voiceChannel.members.size === 1) return message.reply(`Bulunduğun kanal boş!`)
    
        const menu = new Discord.ActionRowBuilder().addComponents(
    new Discord.ChannelSelectMenuBuilder()
          .setCustomId('move-members')
    .setMaxValues(1)
          .setPlaceholder('Taşımak için bir kanal seçin')
    .addChannelTypes(Discord.ChannelType.GuildVoice)
      )
     await message.channel.send({ components: [menu], content: `Taşımak istediğin kanalı seç.`})
    
    
     client.on('interactionCreate', async interaction => {
      if (interaction.customId === 'move-members') {
        const voiceChannel = interaction.member.voice.channel;
    
        const selectedChannelId = interaction.values[0];
        const membersToMove = voiceChannel.members;
    
        membersToMove.forEach(member => {
          member.voice.setChannel(selectedChannelId)
        });
    
            interaction.reply({ content: 'Üyeler taşındı!', ephemeral: true })
              .catch(error => console.error(`İşlem yanıtlanamadı: ${error}`));
          }
        });
    }
}

module.exports = Allmove