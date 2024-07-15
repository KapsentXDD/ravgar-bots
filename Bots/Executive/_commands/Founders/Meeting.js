const { Command } = require("../../../../Global/Structures/Default.Commands");
const { Meetings } = require("../../../../Global/Settings/Schemas");
class Meeting extends Command {
    constructor(client) {
        super(client, {
            name: "meeting",
            description: "Sunucu içerisi toplantı başlatır veya bitirir.",
            usage: "meeting",
            category: "Founders",
            aliases: ["toplantı", "t"],
            enabled: true,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris, c) {
        if (!aris?.Founders.includes(message.member.id) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !system.Bot.Roots.includes(message.member.id) && !c) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
    const green = message.guild.findEmoji(system.Emojis.Onay)
    const red = message.guild.findEmoji(system.Emojis.Iptal)
    const nokta = message.guild.findEmoji(system.Emojis.Nokta)
    const guild = client.guilds.cache.get(system.Guild.ID)

    let MeetingData = await Meetings.findOne({ guildID: message.guild.id })

    let meetingStatus = MeetingData?.Toplantı || false
    const toplantiKanal = message.member.voice.channel;
    if(!toplantiKanal) return message.reply(`Toplantı sistemi için herhangi bir ses kanalında bulunmalısınız.`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));

    if(toplantiKanal && toplantiKanal.members.size < 1) return message.reply(`Toplantı sistemi için ses kanalınızda en az bir kişi olmalı.`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));

    if(MeetingData && MeetingData.userID && MeetingData.channelId && MeetingData.Toplantı && message.guild.channels.cache.get(MeetingData.channelId) && message.member.voice.channel.id != MeetingData.channelId) return message.reply(`Şuan da aktif bir toplantı var. ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalına girerek toplantıyı yönetebilirsin.`).then(x => setTimeout(() => {
      x.delete().catch(err => {})
    }, 7500));
    let Row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
      .setCustomId("toplantıAç")
      .setLabel(`Toplantı ${meetingStatus ? "Bitir" : "Başlat"}`)
      .setStyle(meetingStatus ? Discord.ButtonStyle.Danger : Discord.ButtonStyle.Success),
    )
if(MeetingData && MeetingData.userID && MeetingData.channelId && MeetingData.Date && MeetingData.endAuthorId && MeetingData.endDate && MeetingData.Joining && MeetingData.Leaving) {
embed.addFields({ name: `${nokta} Son Toplantı Bilgisi`, value: `
> Toplantıya **\`${MeetingData.Joining.length}\`** yetkili katılmış ${green}
> Toplantıya **\`${MeetingData.Leaving.length}\`** yetkili katılmamış ${red}
> Toplantıya **\`${MeetingData.Leaving.length + MeetingData.Joining.length}\`** yetkili katılması beklendi.
> Yetkililerin **\`%${(MeetingData.Joining.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmış. **\`%${(MeetingData.Leaving.length/(MeetingData.Leaving.length + MeetingData.Joining.length)*100).toFixed(1)}\`** katılmamış. 
> Toplantı ${message.guild.channels.cache.get(MeetingData.channelId) ? message.guild.channels.cache.get(MeetingData.channelId) : "#silinen-kanal"} kanalında gerçekleşmiş.
> Toplantı <t:${Math.floor(MeetingData.Date / 1000)}:R> tarihinde <@${MeetingData.userID}> tarafından başlatılmış.
> Toplantı <t:${Math.floor(MeetingData.endDate / 1000)}:R> tarihinde <@${MeetingData.endAuthorId}> tarafından bitirilmiş.
> Toplantı **\`${meetingTime(MeetingData.endDate - MeetingData.Date)}\`**  sürmüş.`})
}
message.reply({components: [Row], embeds: [
embed.setDescription(`**Merhaba** ${message.member.user.tag}
**${guild.name}** sunucusunda şuan da toplantı durumu: **${meetingStatus ? "Aktif" : "Devre-dışı"}** ${meetingStatus ? green : red}`)

    ]}).then(async (msg) => {
        var filter = (i) => i.user.id == message.member.id
        let collector = msg.createMessageComponentCollector({filter: filter, time: 120000})
        collector.on('collect', async (i) => {
          if(i.customId == "toplantıAç") {
              let meetingStatus = MeetingData.Toplantı || false
              if(meetingStatus) {
                await meetings.updateOne({guildID: System.Guild.ID}, {$set: {Toplantı: false}}, {upsert: true})
                await meetings.updateOne({guildID: message.guild.id}, {$set: {
                  "endDate": Date.now(),
                  "endAuthorId": i.user.id,
                }}, {upsert: true})
                let KatilimData = await Meetings.findOne({guildID: message.guild.id}) || {Joining: [],Leaving: []};
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla ${message.member.voice.channel} kanalında bulunan toplandı bitirildi.
Son olarak katılım sağlayan tüm yetkililere ${message.guild.roles.cache.has(aris?.katıldıRole) ? message.guild.roles.cache.get(aris?.katıldıRole) : "@Silinen Rol"} rolü dağıtılmaya başlandı.\n
${nokta} **Bitirilen Toplantı Bilgisi**
> Bu toplantıda katılması beklenen **(\`${KatilimData.Leaving.length + KatilimData.Joining.length} yetkili\`)**
> Bu toplantıda katılım sağlayan: **(\`${KatilimData.Joining.length} yetkili\`)** ${green}
> Bu toplantıda katılım sağlamayan: **(\`${KatilimData.Leaving.length} yetkili\`)** ${red}
> Bu toplantı  **\`${meetingTime(KatilimData.endDate - KatilimData.Date)}\`** sürmüş.`)], components: []})
                if(KatilimData && KatilimData.Joining.length > 0) {
                  KatilimData.Joining.forEach(async (id) => {
                    let uye = message.guild.members.cache.get(id)
                    if(uye) uye.roles.add(aris?.katıldıRole).catch(err => {}) 
                  })
                }
                await i.deferUpdate().catch(err => {})
              } else {
                msg.delete().catch(err => {})
                let katildiRolü = message.guild.roles.cache.get(aris?.katıldıRole)
                if (katildiRolü) {
                const members = [...guild.members.cache.filter(member => member.roles.cache.has(aris?.katıldıRole)).values()].splice(0, 10)
                for await (const member of members) {
                await member.roles.remove(katildiRolü.id).catch(err => {})
                }}
                
                await message.channel.send({embeds: [new Discord.EmbedBuilder().setDescription(`Başarıyla ${message.member.voice.channel} kanalında toplantı başladı.\nLütfen biraz bekleyiniz toplantı kanalında yoklama alınıyor.`)]})
                await i.deferUpdate().catch(err => {})
                await meetings.deleteMany({guildID: message.guild.id})
                let datax = await Meetings.findOne({ guildID: System.Guild.ID })
                if(!datax) {await meetings.updateOne({guildID: System.Guild.ID}, {$set: {Toplantı: true}}, {upsert: true})}
                await meetings.updateOne({guildID: message.guild.id}, {$set: {
                  "Date": Date.now(),
                  "userID": i.user.id,
                  "channelId": message.member.voice.channel.id,
                }}, {upsert: true})

                let datax2 = await Meetings.findOne({ guildID: System.Guild.ID })
                if (datax2) {
                  let enAltYetkiliRolü = message.guild.roles.cache.get(aris?.minStaff)
                  let uyeler = [...message.guild.members.cache.values()];
                  let filteruye = uyeler.filter(uye => !uye.user.bot  && uye.roles.highest.position >= enAltYetkiliRolü.position)
                  let sestekiYetkililer = filteruye.filter(uye => uye.voice.channel && uye.voice.channel.id == datax2.channelId);
                  let sesteOlmayanYetkililer = filteruye.filter(uye => !uye.voice.channel);
      
                  sestekiYetkililer.map(async (uye) => {
                    if (!datax2.Joining.includes(uye.id)) {
                        if(datax2.Leaving.includes(uye.id)) {
                          await meetings.updateOne({guildID: message.guild.id}, {$pull: {Leaving: uye.id}}, {upsert: true})
                        } else {
                          await meetings.updateOne({guildID: message.guild.id}, {$push: {Joining: uye.id}}, {upsert: true})
                        }
                    }
                  })
      
                  sesteOlmayanYetkililer.map(async (uye) => {
                    if (!datax2.Leaving.includes(uye.id) ) {
                        if(datax2.Joining.includes(uye.id)) {
                          await meetings.updateOne({guildID: message.guild.id}, {$pull: {Joining: uye.id}}, {upsert: true})
                        } else {
                          await meetings.updateOne({guildID: message.guild.id}, {$push: {Leaving: uye.id}}, {upsert: true})
                      }
                    }
                  })
  
                  sesteOlmayanYetkililer.forEach((yetkili) => {
                    setTimeout(() => {  
                      yetkili.send(`**${guild.name}** Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.`).catch(err => message.channel.send(`${yetkili}, Sunucusunda toplantı başladı. Yetkili olduğun halde toplantıda değilsin. Eğer toplantıya girmezsen yetkilerin alınacaktır.`));
                    }, 2000);
                  });
                }
              }
          }
        })
        collector.on('end', async (i) => {
          msg.delete().catch(err => {})
        })
    })
    }
}

function meetingTime(duration) {  
    let arr = []
    if (duration / 3600000 > 1) {
      let val = parseInt(duration / 3600000)
      let durationn = parseInt((duration - (val * 3600000)) / 60000)
      arr.push(`${val} saat`)
      arr.push(`${durationn} dakika`)
    } else {
      let durationn = parseInt(duration / 60000)
      arr.push(`${durationn} dakika`)
    }
    return arr.join(", ") 
  };

module.exports = Meeting