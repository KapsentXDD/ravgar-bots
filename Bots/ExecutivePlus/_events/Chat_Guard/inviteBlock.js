const Ariscik = require("../../../../Global/Settings/Ariscik");
const { Event } = require("../../../../Global/Structures/Default.Events");

class InviteBlock extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }

    async onLoad(message) {

        const inviteEngel = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

        const aris = await Ariscik.findOne({ guildID: message.guild.id });
        if (aris?.chatGuard == true) {
            if (aris?.Chat.includes(message.member.id)) return;
            if (message.content.match(inviteEngel)) {
                const invites = await message.guild.invites.fetch();
                if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;

                if (!message.member.reklamSayisi) {
                    message.member.reklamSayisi = 1;
                } else {
                    message.member.reklamSayisi++;
                }

                if (message.member.reklamSayisi >= 3) {
                    if (message.deletable) message.delete().catch(err => {});
                    message.channel.send({ content: `${message.member} reklam yapman yasak! 3 kere daha reklam yaparsan susturulacaksın!` }).sil(3);
                    message.member.reklamSayisi = 0;

                    setTimeout(async () => {
                        if (aris?.mutedRole) {
                            await message.member.roles.remove(aris.mutedRole).catch(err => console.error("Muted rolü kaldırılırken bir hata oluştu:", err));
                            message.channel.send({ content: `${message.member} susturması kaldırıldı!` }).sil(3);
                        } else {
                            console.error("Muted rolü bulunamadı veya ayarlanmamış.");
                        }
                    }, 10 * 60 * 1000); 
                } else {
                    if (message.deletable) message.delete().catch(err => {});
                    message.channel.send({ content: `${message.member} reklam yapman yasak! 3 kere daha reklam yaparsan susturulacaksın!` }).sil(3);
                }
            }
        }
    }
}

module.exports = InviteBlock;