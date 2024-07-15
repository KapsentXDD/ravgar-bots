const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
let Bots = global.bots = []
module.exports = Bots
system.Tokens.DistTokens.forEach(token => {
    let clients = new Client({
        fetchAllMembers: true,
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.User,
            Partials.GuildMember,
            Partials.Reaction
        ],
        presence: {
            status: "invisible"
        },
    });
    clients.on("ready", () => {
        Bots.push(clients);
    })
    async function urlSpam() {
        const ariscik = require("../Global/Settings/Ariscik");
        const Discord = require('discord.js'); 
        const aris = await ariscik.findOne({ guildID: system.Guild.ID });
        const log = clients.channels.cache.find(x => x.name === "guard-log"); 
        const request = require('request');
        const guild = clients.guilds.cache.get(system.Guild.ID);
        const owner = guild.ownerId;
        if (!guild || !aris?.guildURL) return; 
        if (guild.vanityURLCode && (guild.vanityURLCode === aris?.guildURL)) return;
        const hatamesajı = "URL DEĞİŞTİ AMA SUNUCU SAHİBİNE MESAJ GÖNDEREMEDİM!";
        const onaymesajı = "URL Değiştirildi. Kontrolüme Takıldı ve Bende Tekrardan URL'yi geri aldım.";
        if (!log) {
            const ownerUser = await clients.users.fetch(owner); 
            ownerUser.send({ embeds: [new Discord.EmbedBuilder().setDescription(onaymesajı)] }).catch(err => console.log(hatamesajı));
        } else {
            log.send({ content: `<@${owner}>`, embeds: [new Discord.EmbedBuilder().setDescription(onaymesajı)] });
        }
        request({ url: `https://discord.com/api/v6/guilds/${guild.id}/vanity-url`, body: { code: aris?.guildURL }, json: true, method: 'PATCH', headers: { "Authorization": `Bot ${token}` } }, (err, res, body) => {
            if (err) {
                console.log("Malesef Fonksiyon Çalışmadı...");
            }
        });
    }
    clients.on("ready", async () => {
        const guild = clients.guilds.cache.get(system.Guild.ID);
        if (guild.premiumTier === 3) { 
            setInterval(urlSpam, 1000);
        }
    }); // bunu aldırmamız lazım bu kod çalısıyor ama almıyor
    
    clients.login(token).then(e => {
    }).catch(e => {
        console.log(`${token.substring(Math.floor(token.length / 2))} giriş yapamadı.`);
    });
});
    Selfb.on('ready', () => {
        console.log(`[${tarihsel(Date.now())}] Başarıyla ${Selfb.user.tag} adlı hesaba giriş yapıldı.`)
    })
    Selfb.login(system.Tokens.SelfToken).catch(e => {
        console.log(`[${tarihsel(Date.now())}] ${Selfb.user.tag} adlı hesaba giriş yapılamadı.`)
    })
