
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { LeftedRole } = require("../../../../Global/Settings/Schemas")

class oldRoles extends Command {
    constructor(client) {
        super(client, {
            name: "eskirol",
            description: "Yetkili kişilerin sunucudan çıkmadan önceki rollerini geri verir.",
            usage: "eskirol",
            category: "Founders",
            aliases: ["oldroles","eskirol"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!aris?.Founders.includes(message.member.id) && !system.Bot.Roots.includes(message.member.id)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}eskirol <<ID>>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)

        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let data = await LeftedRole.findOne({_id: uye.id})
    let load = await message.reply({content: `${uye.user} üyesinin çıkmadan önceki yetki rolleri listeleniyor. Lütfen bekleyin...`})
    
    if (!data) {
        return message.reply({ content: `${uye.user} üyesinin çıkmadan önceki yetki bilgileri veritabanımızda bulunamadı!` });
      }  
    
    const row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setCustomId(`tanımla`).setLabel(`Rolleri ver!`).setStyle(Discord.ButtonStyle.Secondary)
    )
    load.edit({ content: null, components: [row], embeds: [new Discord.EmbedBuilder().setDescription(`Aşağı da ${uye} isimli üyenin sunucudan atılmadan/çıkmadan önceki rol veya rolleri listelenmektedir. 

**Rol(ler) şunlardır**:
${data._roles.filter(x => message.guild.roles.cache.get(x)).map(x => message.guild.roles.cache.get(x)).join("\n")}`)] })

    const filter = i => i.user.id == message.author.id
    let collector = load.createMessageComponentCollector({ filter, time: 30000 })
    collector.on('collect', async (i) => {
        if(i.customId == "tanımla") {
            i.reply({ content: `Başarıyla ${uye} isimli üyenin rollerine eski rolleri tanımlandı ve verisi temizlendi.`, ephemeral: true})
            let rol = []
            data._roles.filter(x => message.guild.roles.cache.get(x)).map(x => rol.push(x))
            uye.setRoles(rol)
            await LeftedRole.deleteOne({_id: uye.id})
        }
    })

    }
}

module.exports = oldRoles

