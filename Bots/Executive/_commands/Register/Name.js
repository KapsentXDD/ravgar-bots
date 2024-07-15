
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { User } = require("../../../../Global/Settings/Schemas")
class Name extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
            description: "Sunucu içerisi bir üyenin ismini değiştirmenizi sağlar.",
            usage: "isim <ID> <İsim> <Yaş>",
            category: "Register",
            aliases: ["isim", "name", "i"],
            enabled: true,
            cooldown: 3500,
        });
    }

    async onLoad(client) {

    }

    async onRequest(client, message, args, embed, aris) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!aris?.registerHammer.some(oku => message.member.roles.cache.has(oku)) && !aris?.foundingRoles.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.channel.send({ content: system.Replys.NoAuth }).sil(20)
        if (!member) return message.channel.send({ content: system.Replys.Member + ` \`${system.Bot.Prefixs[0]}isim <<ID>> <Isim> <Yaş>\`` }).sil(20)
        if (message.author.id === member.id) return message.channel.send({ content: system.Replys.ItSelf }).sil(20)
        if (member.user.bot) return message.channel.send({ content: system.Replys.Bot }).sil(20)
        if (!member.manageable) return message.channel.send({ content: system.Replys.NoYt }).sil(20)
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send({ content: system.Replys.SAuth }).sil(20)
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0]
        let setName;
        if (!name || !age) return message.channel.send({ content: system.Replys.NoName }).sil(20)
        setName = `${aris?.tags.some(x => member.user.tag.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} ${name} | ${age}`;
        member.setNickname(`${setName}`).catch(err => { });
        await User.updateOne({ userID: member.id }, { $set: { "Name": name, "Age": age } }, { upsert: true }).exec();
        await User.updateOne({ userID: member.id }, { $push: { "Names": { Author: message.member.id, Date: Date.now(), Name: name, Age: age, ProInf: "İsim Güncelleme" } } }, { upsert: true }).exec();
        let isimveri = await User.findOne({ userID: member.id }) || [];
        let isimler = isimveri?.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\`${aris?.tags[0]} ${value.Name} | ${value.Age}\` (${value.ProInf}) ${value.Author ? "(<@" + value.Author + ">)" : ""}`).join("\n") : "";
        if (message) message.react(message.guild.findEmoji(system.Emojis.Onay))
        message.channel.send({ embeds: [embed.setDescription(`
${member} (\`${member.id}\`) kişisinin ismi başarılı bir şekilde \`${setName}\` olarak değiştirildi!

Bu kişi daha önce şu isimlerle kayıt olmuş; (${isimveri.Names.length})

${isimler}
        `).setFooter({ text: `Kişinin önceki isimlerine bakmak için .isimler ${member.id}`, iconURL: client.user.avatarURL({ dynamic: true })})] })
    }
}

module.exports = Name