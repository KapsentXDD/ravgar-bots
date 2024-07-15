
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User, Upstaff } = require("../../../../Global/Settings/Schemas")
class Register extends Command {
    constructor(client) {
        super(client, {
            name: "kayıt",
            description: "Sunucu içerisi kayıt yapmanızı sağlar.",
            usage: "kayıt <ID> <İsim> <Yaş>",
            category: "Register",
            aliases: ["e", "k", "erkek", "kadın", "man", "woman", "kız"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        if (!aris?.manRoles || !aris?.womanRoles || aris?.manRoles.length <= 0 || aris?.womanRoles <= 0) return message.channel.send({ content: system.Replys.Data })
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}kayıt <<ID>> <Isim> <Yaş>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (aris?.manRoles.some(x => member.roles.cache.has(x))) return message.channel.send({ content: system.Replys.Registered }).sil(20)
        if (aris?.womanRoles.some(x => member.roles.cache.has(x))) return message.channel.send({ content: system.Replys.Registered }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.SAuth }).sil(20)
        if (aris?.tagMode == true && !aris?.tags.some(a => member.user.tag.includes(a)) && !member.roles.cache.has(aris?.boosterRole) && !member.roles.cache.has(aris?.vipRole) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) return message.channel.send({ content: system.Replys.TagMode }).sil(20)
        if (member.roles.cache.has(aris?.suspectRole) && member.roles.cache.has(aris?.jailedRole) && member.roles.cache.has(aris?.bannedTagRole) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku))) return message.channel.send({ content: system.Replys.PunUser }).sil(20)
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0]
        let setName;
        if (!name || !age) return message.channel.send({ content: system.Replys.NoName }).sil(20)
        setName = `${aris?.tags.some(x => member.user.tag.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} ${name} | ${age}`;
        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId("buttonerkek").setLabel("Erkek").setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId("buttonkadın").setLabel("Kadın").setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder().setCustomId("buttoniptal").setLabel("İptal").setStyle(Discord.ButtonStyle.Danger),
            )
        let msg = await message.channel.send({
            components: [row], embeds: [embed
                .setFooter({ text: `İşlem 30 saniye içerisinde otomatik iptal edilecektir, kişinin bilinen isimlerini görmek için .gn komutunu kullanın`, iconURL: message.member.avatarURL({ dynamic: true }) })
                .setDescription(`
${member} (\`${member.id}\`) kullanıcısının kayıtının tamamlanması için aşağıdaki butonları kullanın!
        `)]
        })
        var filter = (button) => button.user.id === message.member.id;
        let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

        collector.on("collect", async (button) => {
            button.deferUpdate(true)
            if (button.customId === "buttonerkek") {
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                member.setNickname(`${setName}`).catch(err => { });
                if (msg) msg.edit({
                    components: [row],
                    embeds: [new Discord.EmbedBuilder().setDescription(`
${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kullanıcısı **ERKEK** olarak kayıt edildi!
                    `)]
                })
                register(member, message.member, name, age, "man", message, aris)
            }
            if (button.customId === "buttonkadın") {
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                member.setNickname(`${setName}`).catch(err => { });
                if (msg) msg.edit({
                    components: [row],
                    embeds: [new Discord.EmbedBuilder().setDescription(`
${message.guild.findEmoji(system.Emojis.Onay)} ${member} (\`${member.id}\`) kullanıcısı **KADIN** olarak kayıt edildi!
                    `)]
                })
                register(member, message.member, name, age, "woman", message, aris)
            }
            if (button.customId === "buttoniptal") {
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                message.react(message.guild.findEmoji(system.Emojis.Iptal))
                if (msg) msg.edit({
                    components: [row],
                    embeds: [new Discord.EmbedBuilder().setDescription(`
${message.guild.findEmoji(system.Emojis.Iptal)} ${member} (\`${member.id}\`) kullanıcısının kayıt işlemi iptal edildi!
                    `)]
                })
            }
        });
        collector.on("end", async (collected, reason) => {
            if (reason == "time") {
                if (msg) msg.delete();
            }
        })
    }
}

module.exports = Register

async function register(member, auth, name, age, gender, message, aris) {
    let cins;
    if (gender == "man") {
        await member.roles.add(aris?.manRoles).catch(err => { })
        cins = "Erkek"
    } else if (gender == "woman") {
        await member.roles.add(aris?.womanRoles).catch(err => { })
        cins = "Kadın"
    }
    await member.roles.remove(aris?.unregisterRoles).catch(err => { })
    const upData = await Upstaff.findOne({ userID: auth.id })
    if (upData?.GorevDurum == true && upData?.GorevTip == "Kayıt") {
        await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: message.member.id }, { $inc: { YapilanGorev: 1 } }, { upsert: true }).exec();
        if (upData?.YapilanGorev >= upData?.GorevAdet) {
            let kazanilan = getRandomInt(50, 100)
            message.guild.channels.cache.find(x => x.name == "task-log").send({
                content: `${message.member} kişisi ${upData?.Gorev ? upData?.Gorev : "Bulunamadı!"} görevini bitirerek ${kazanilan} coin kazandı!`
            })
            await Upstaff.findOneAndUpdate({ guildID: message.guild.id, userID: auth.id }, { $set: { Gorev: ``, GorevAdet: ``, GorevTip: ``, GorevDurum: false } }, { upsert: true }).exec();
            await Upstaff.updateOne({ guildID: message.guild.id, userID: auth.id }, { $inc: { coin: kazanilan, ToplamGorev: 1, ToplamPuan: kazanilan } }, { upsert: true });
        }
    }
    await User.updateOne({ userID: auth.id }, { $inc: { "TopConfs": 1 } }, { upsert: true }).exec();
    await User.updateOne({ userID: auth.id }, { $push: { "Confs": { Member: member.id, Gender: gender, Date: Date.now() } } }, { upsert: true }).exec();
    await User.updateOne({ userID: member.id }, { $push: { "Names": { Author: auth.id, Date: Date.now(), Name: name, Age: age, ProInf: "Register" } } }, { upsert: true }).exec();
    await User.updateOne({ userID: member.id }, { $set: { "Gender": gender, "Name": name, "Age": age, "Author": auth.id } }, { upsert: true }).exec();

    const selamla = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder().setLabel("Selam Ver!").setEmoji("955964713353740328").setCustomId("selamver").setStyle(Discord.ButtonStyle.Primary)
    )
    if (aris?.chatChannel) client.channels.cache.get(aris?.chatChannel).send({ content: `${member} kişisi aramıza katıldı ona merhaba diyelim!` }).sil(5)
    auth.guild.findChannel("register-log").send({
        embeds: [new Discord.EmbedBuilder().setDescription(`
\`>\` Sunucuda bir kayıt gerçekleşti!

Kaydeden kişi : ${auth} (\`${auth.id}\`)
Kaydedilen kişi : ${member} (\`${member.id}\`) 
Cinsiyeti : **${cins}**
        `)]
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}