const Ariscik = require("../../../../Global/Settings/Ariscik");
const { Event } = require("../../../../Global/Structures/Default.Events");

class Swear extends Event {
    constructor(client) {
        super(client, {
            name: "messageCreate",
            enabled: true,
        });
    }

    async onLoad(message) {

        const swears = ["orspu", "sktmn", "allahoc", "allahoç", "allahamk", "allahaq", "0r0spuc0cu", "4n4n1 sk3r1m", "p1c", "@n@nı skrm", "orsb", "orsbcogu", "amnskm", "anaskm", "oc", "abazan", "a\u011fz\u0131na s\u0131\u00e7ay\u0131m", "fuck", "shit", "seks", "sex", "allahs\u0131z", "amar\u0131m", "ambiti", "am biti", "amc\u0131\u011f\u0131", "amc\u0131\u011f\u0131n", "amc\u0131\u011f\u0131n\u0131", "amc\u0131\u011f\u0131n\u0131z\u0131", "amc\u0131k", "amc\u0131k ho\u015faf\u0131", "amc\u0131klama", "amc\u0131kland\u0131", "amcik", "amck", "amckl", "amcklama", "amcklaryla", "amckta", "amcktan", "amcuk", "am\u0131k", "am\u0131na", "amına", "am\u0131nako", "am\u0131na koy", "am\u0131na koyar\u0131m", "am\u0131na koyay\u0131m", "am\u0131nakoyim", "am\u0131na koyyim", "am\u0131na s", "am\u0131na sikem", "am\u0131na sokam", "am\u0131n feryad\u0131", "am\u0131n\u0131", "am\u0131n\u0131 s", "am\u0131n oglu", "am\u0131no\u011flu", "am\u0131n o\u011flu", "am\u0131s\u0131na", "am\u0131s\u0131n\u0131", "amina", "amina g", "amina k", "aminako", "aminakoyarim", "amina koyarim", "amina koyay\u0131m", "amina koyayim", "aminakoyim", "aminda", "amindan", "amindayken", "amini", "aminiyarraaniskiim", "aminoglu", "amin oglu", "amiyum", "amk", "amkafa", "amk \u00e7ocu\u011fu", "amlarnzn", "aml\u0131", "ammna", "amn", "amna", "amnda", "amndaki", "amngtn", "amnn", "amona", "amq", "ams\u0131z", "amsiz", "amsz", "amteri", "amugaa", "amu\u011fa", "amuna", "anaaann", "anal", "analarn", "anana", "anandan", "anan\u0131", "anan\u0131", "anan\u0131n", "anan\u0131n am", "anan\u0131n am\u0131", "anan\u0131n d\u00f6l\u00fc", "anan\u0131nki", "anan\u0131sikerim", "anan\u0131 sikerim", "anan\u0131sikeyim", "anan\u0131 sikeyim", "anan\u0131z\u0131n", "anan\u0131z\u0131n am", "anani", "ananin", "ananisikerim", "anani sikerim", "ananisikeyim", "anani sikeyim", "anann", "ananz", "anas", "anas\u0131n\u0131", "anas\u0131n\u0131n am", "anas\u0131 orospu", "anasi", "anasinin", "anayin", "angut", "anneni", "annenin", "annesiz", "anuna", "aq", "a.q", "a.q.", "aq.", "atkafas\u0131", "atm\u0131k", "att\u0131rd\u0131\u011f\u0131m", "attrrm", "auzlu", "avrat", "ayklarmalrmsikerim", "azd\u0131m", "azd\u0131r", "azd\u0131r\u0131c\u0131", "babaannesi ka\u015far", "baban\u0131", "baban\u0131n", "babani", "babas\u0131 pezevenk", "baca\u011f\u0131na s\u0131\u00e7ay\u0131m", "bac\u0131na", "bac\u0131n\u0131", "bac\u0131n\u0131n", "bacini", "bacn", "bacndan", "bacy", "bastard", "b\u0131z\u0131r", "bitch", "biting", "boner", "bosalmak", "bo\u015falmak", "cenabet", "cibiliyetsiz", "cibilliyetini", "cibilliyetsiz", "cikar", "\u00e7\u00fck", "dalaks\u0131z", "dallama", "daltassak", "dalyarak", "dalyarrak", "dangalak", "dassagi", "dildo", "dingil", "dingilini", "dkerim", "domal", "domalan", "domald\u0131", "domald\u0131n", "domal\u0131k", "domal\u0131yor", "domalmak", "domalm\u0131\u015f", "domals\u0131n", "domalt", "domaltarak", "domalt\u0131p", "domalt\u0131r", "domalt\u0131r\u0131m", "domaltip", "domaltmak", "d\u00f6l\u00fc", "d\u00f6nek", "d\u00fcd\u00fck", "eben", "ebeni", "ebenin", "ebeninki", "ecdad\u0131n\u0131", "ecdadini", "embesil", "fahise", "fahi\u015fe", "feri\u015ftah", "fuck", "fucker", "fuckin", "fucking", "gavad", "gavat", "giberim", "giberler", "gibi\u015f", "goddamn", "godo\u015f", "godumun", "gotelek", "gotlalesi", "gotlu", "gotten", "gotundeki", "gotunden", "gotune", "gotunu", "gotveren", "goyiim", "goyum", "goyuyim", "goyyim", "g\u00f6t deli\u011fi", "g\u00f6telek", "g\u00f6t herif", "g\u00f6tlalesi", "g\u00f6tlek", "g\u00f6to\u011flan\u0131", "g\u00f6t o\u011flan\u0131", "g\u00f6to\u015f", "g\u00f6tten", "g\u00f6t\u00fcn", "g\u00f6t\u00fcne", "g\u00f6t\u00fcnekoyim", "g\u00f6t\u00fcne koyim", "g\u00f6t\u00fcn\u00fc", "g\u00f6tveren", "g\u00f6t veren", "g\u00f6t verir", "gtelek", "gtn", "gtnde", "gtnden", "gtne", "gtten", "gtveren", "hasiktir", "hassikome", "hassiktir", "has siktir", "hassittir", "haysiyetsiz", "hayvan herif", "ho\u015faf\u0131", "h\u00f6d\u00fck", "hsktr", "\u0131bnel\u0131k", "ibina", "ibine", "ibinenin", "ibne", "ibnedir", "ibneleri", "ibnelik", "ibnelri", "ibneni", "ibnenin", "ibnerator", "ibnesi", "idiot", "idiyot", "imansz", "ipne", "i\u015ferim", "ito\u011flu it", "kafam girsin", "kafas\u0131z", "kafasiz", "kahpenin", "kahpenin feryad\u0131", "kaka", "kaltak", "kanc\u0131k", "kancik", "kappe", "karhane", "ka\u015far", "kavat", "kavatn", "kerane", "kerhane", "kerhanelerde", "kevase", "keva\u015fe", "kevvase", "koca g\u00f6t", "kodu\u011fmun", "kodu\u011fmunun", "kodumun", "kodumunun", "koduumun", "koyarm", "koyay\u0131m", "koyiim", "koyiiym", "koyim", "koyum", "koyyim", "krar", "kukudaym", "laciye boyad\u0131m", "libo\u015f", "madafaka", "malafat", "malak", "mcik", "meme", "memelerini", "mezveleli", "minaamc\u0131k", "mincikliyim", "mna", "monakkoluyum", "motherfucker", "mudik", "oc", "ocuu", "ocuun", "O\u00c7", "o\u00e7", "o. \u00e7ocu\u011fu", "o\u011flan", "o\u011flanc\u0131", "o\u011flu it", "orosbucocuu", "orospu", "orospu evladı", "orospu evladi", "orospucocugu", "orospu cocugu", "orospu \u00e7oc", "orospu\u00e7ocu\u011fu", "orospu \u00e7ocu\u011fu", "orospu \u00e7ocu\u011fudur", "orospu \u00e7ocuklar\u0131", "orospudur", "orospular", "orospunun", "orospunun evlad\u0131", "orospuydu", "orospuyuz", "orostoban", "orostopol", "orrospu", "oruspu", "oruspu\u00e7ocu\u011fu", "oruspu \u00e7ocu\u011fu", "ossurduum", "ossurmak", "ossuruk", "osur", "osurduu", "osuruk", "osururum", "\u00f6k\u00fcz", "\u00f6\u015fex", "patlak zar", "penis", "pezevek", "pezeven", "pezeveng", "pezevengi", "pezevengin evlad\u0131", "pezevenk", "pezo", "pic", "pici", "picler", "pi\u00e7", "pi\u00e7in o\u011flu", "pi\u00e7 kurusu", "pi\u00e7ler", "pipi", "pipi\u015f", "porno", "pussy", "pu\u015ft", "pu\u015fttur", "rahminde", "revizyonist", "s1kerim", "s1kerm", "s1krm", "sakso", "saksofon", "saxo", "sekis", "serefsiz", "sevgi koyar\u0131m", "sevi\u015felim", "sexs", "s\u0131\u00e7ar\u0131m", "s\u0131\u00e7t\u0131\u011f\u0131m", "s\u0131ecem", "sicarsin", "sie", "sik", "sikdi", "sikdi\u011fim", "sike", "sikecem", "sikem", "siken", "sikenin", "siker", "sikerim", "sikerler", "sikersin", "sikertir", "sikertmek", "sikesen", "sikesicenin", "sikey", "sikeydim", "sikeyim", "sikeym", "siki", "sikicem", "sikici", "sikien", "sikienler", "sikiiim", "sikiiimmm", "sikiim", "sikiir", "sikiirken", "sikik", "sikil", "sikildiini", "sikilesice", "sikilmi", "sikilmie", "sikilmis", "sikilmi\u015f", "sikilsin", "sikim", "sikimde", "sikimden", "sikime", "sikimi", "sikimiin", "sikimin", "sikimle", "sikimsonik", "sikimtrak", "sikin", "sikinde", "sikinden", "sikine", "sikini", "sikip", "sikis", "sikisek", "sikisen", "sikish", "sikismis", "siki\u015f", "siki\u015fen", "siki\u015fme", "sikitiin", "sikiyim", "sikiym", "sikiyorum", "sikkim", "sikko", "sikleri", "sikleriii", "sikli", "sikm", "sikmek", "sikmem", "sikmiler", "sikmisligim", "siksem", "sikseydin", "sikseyidin", "siksin", "siksinbaya", "siksinler", "siksiz", "siksok", "siksz", "sikt", "sikti", "siktigimin", "siktigiminin", "sikti\u011fim", "sikti\u011fimin", "sikti\u011fiminin", "siktii", "siktiim", "siktiimin", "siktiiminin", "siktiler", "siktim", "siktim", "siktimin", "siktiminin", "siktir", "siktir et", "siktirgit", "siktir git", "siktirir", "siktiririm", "siktiriyor", "siktir lan", "siktirolgit", "siktir ol git", "sittimin", "sittir", "skcem", "skecem", "skem", "sker", "skerim", "skerm", "skeyim", "skiim", "skik", "skim", "skime", "skmek", "sksin", "sksn", "sksz", "sktiimin", "sktrr", "skyim", "slaleni", "sokam", "sokar\u0131m", "sokarim", "sokarm", "sokarmkoduumun", "sokay\u0131m", "sokaym", "sokiim", "soktu\u011fumunun", "sokuk", "sokum", "soku\u015f", "sokuyum", "soxum", "sulaleni", "s\u00fclaleni", "s\u00fclalenizi", "s\u00fcrt\u00fck", "\u015ferefsiz", "\u015f\u0131ll\u0131k", "taaklarn", "taaklarna", "tarrakimin", "tasak", "tassak", "ta\u015fak", "ta\u015f\u015fak", "tipini s.k", "tipinizi s.keyim", "tiyniyat", "toplarm", "topsun", "toto\u015f", "vajina", "vajinan\u0131", "veled", "veledizina", "veled i zina", "verdiimin", "weled", "weledizina", "whore", "xikeyim", "yaaraaa", "yalama", "yalar\u0131m", "yalarun", "yaraaam", "yarak", "yaraks\u0131z", "yaraktr", "yaram", "yaraminbasi", "yaramn", "yararmorospunun", "yarra", "yarraaaa", "yarraak", "yarraam", "yarraam\u0131", "yarragi", "yarragimi", "yarragina", "yarragindan", "yarragm", "yarra\u011f", "yarra\u011f\u0131m", "yarra\u011f\u0131m\u0131", "yarraimin", "yarrak", "yarram", "yarramin", "yarraminba\u015f\u0131", "yarramn", "yarran", "yarrana", "yarrrak", "yavak", "yav\u015f", "yav\u015fak", "yav\u015fakt\u0131r", "yavu\u015fak", "y\u0131l\u0131\u015f\u0131k", "yilisik", "yogurtlayam", "yo\u011furtlayam", "yrrak", "z\u0131kk\u0131m\u0131m", "zibidi", "zigsin", "zikeyim", "zikiiim", "zikiim", "zikik", "ermeni", "zikim", "ziksiiin", "ziksiin", "zulliyetini", "zviyetini"]

  
        const aris = await Ariscik.findOne({ guildID: message.guild.id });
        if (aris?.chatGuard == true) {
            if (aris?.Chat.includes(message.member.id)) return;
            const swear = new RegExp(`${swears.join("|")}`, 'gi');
            const content = message.content.toLocaleLowerCase().trim();
            if (content.match(swear)) {
                if (!message.member.kufurSayisi) {
                    message.member.kufurSayisi = 1;
                } else {
                    message.member.kufurSayisi++;
                }

                if (message.member.kufurSayisi >= 3) {
                    const member = message.member;
                    const mutedRole = aris?.mutedRole;

                    if (mutedRole) {
                        await member.roles.add(mutedRole).catch(err => console.error("Muted rolü verilirken bir hata oluştu:", err));
                        if (message.guild.channels.cache.find(x => x.name == "chat-log")) {
                            message.guild.channels.cache.find(x => x.name == "chat-log").send({
                                embeds: [
                                    new Discord.EmbedBuilder()
                                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 1024 }) })
                                        .setThumbnail(message.author.avatarURL())
                                        .setDescription(`
Sunucuda bir küfür tespit edildi ve mesaj ${message.deletable ? "başarıyla silindi!" : "malesef silinemedi!"}

Mesajı atan kişi : ${message.member} [${message.author.tag}] (\`${message.member.id}\`)
Mesajın atıldığı kanal : ${message.channel} [${message.channel.name}] (\`${message.channel.id}\`)
Mesaj içeriği ;
\`\`\`${message.content}\`\`\`
                                        `)
                                ]
                            });
                        }
                        message.channel.send({ content: `${message.member} 3 kez küfür ettiği için susturuldu!` }).sil(3);
                        message.member.kufurSayisi = 0;

                         
                        setTimeout(async () => {
                            await member.roles.remove(mutedRole).catch(err => console.error("Muted rolü kaldırılırken bir hata oluştu:", err));
                            message.channel.send({ content: `${message.member} susturması kaldırıldı!` }).sil(3);
                        }, 10 * 60 * 1000);
                    } else {
                        console.error("Muted rolü bulunamadı veya ayarlanmamış.");
                    }
                } else {
                    if (message.deletable) message.delete().catch(err => {});
                    message.channel.send({ content: `${message.member} küfür etmen yasak! 3 kere daha küfür edersen susturulacaksın!` }).sil(3);
                }
            }
        }
    }
}

module.exports = Swear;