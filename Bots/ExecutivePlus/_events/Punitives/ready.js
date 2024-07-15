const { Event } = require("../../../../Global/Structures/Default.Events");
const { Punitives, VMute, Mute, Jail, User } = require("../../../../Global/Settings/Schemas")

class Ready extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            enabled: true,
        });
    }

    async onLoad() {
        setTimeout(() => {
            client._logger.log(`Punitives data in checking started.`, "event");
        }, 1000)
        setInterval(() => {
            muteControl()
            voiceControl();
            jailControl();
            underControl();
        }, 15000);
    }
}

module.exports = Ready;


async function muteControl() {
    const aris = await ariscik.findOne({ guildID: system.Guild.ID })
    let Muteler = await Mute.find()
    for (let ceza of Muteler) {
        let uye = client.guilds.cache.get(system.Guild.ID).members.cache.get(ceza.userID);
        if (ceza.Kalkma && Date.now() >= ceza.Kalkma) {
            if (uye && uye.manageable) await uye.roles.remove(aris?.mutedRole).catch(x => client._logger.log("Chatmute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
            if (await Punitives.findOne({ No: ceza.No })) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now() } }, { upsert: true }).exec();
            await Mute.findOneAndDelete({ userID: ceza.userID })
        } else {
            if (uye && uye.manageable) await uye.roles.add(aris?.mutedRole).catch(x => client._logger.log("Chatmute rolü ceza tarayıcısı tarafından eklenemedi.", "caution"));
        };
    };
}

async function underControl() {
    const aris = await ariscik.findOne({ guildID: system.Guild.ID })
    if (aris?.underWorld) {
        let UnderWorld = await Punitives.find()
        for (let ceza of UnderWorld) {
            let uye = client.guilds.cache.get(system.Guild.ID).members.cache.get(ceza.userID);
            if (ceza.Tip && ceza.Tip == "Yasaklanma") {
                if (uye && uye.manageable) await uye.setRoles(aris?.underWorld).catch(x => client._logger.log("Underworld rolü verilemedi lütfen Rol ID'sini kontrol et.", "caution"));;
            }
        };
    }
}

async function voiceControl() {
    const aris = await ariscik.findOne({ guildID: system.Guild.ID })
    let Sesmute = await VMute.find()
    for (let ceza of Sesmute) {
        let uye = client.guilds.cache.get(system.Guild.ID).members.cache.get(ceza.userID);
        if (ceza.Kalkma && Date.now() >= ceza.Kalkma) {
            if (uye && uye.voice.channel) await uye.voice.setMute(false);
            if (uye && uye.manageable) await uye.roles.remove(aris?.vmutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından alınamadı.", "caution"));
            if (await Punitives.findOne({ No: ceza.No })) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now() } }, { upsert: true }).exec();
            await VMute.findOneAndDelete({ userID: ceza.userID })
        } else {
            if (uye && uye.manageable) await uye.roles.add(aris?.vmutedRole).catch(x => client._logger.log("VoiceMute rolü ceza tarayıcısı tarafından eklenemedi.", "caution"));
        };
    };
}

async function jailControl() {
    const aris = await ariscik.findOne({ guildID: system.Guild.ID })
    let Cezalı = await Jail.find()
    for (let ceza of Cezalı) {
        let uye = client.guilds.cache.get(system.Guild.ID).members.cache.get(ceza.userID);
        if (uye && ceza.Kalkma && Date.now() >= ceza.Kalkma) {
            await Jail.deleteOne({ userID: ceza.userID })
            if (await Punitives.findOne({ No: ceza.No })) await Punitives.updateOne({ No: ceza.No }, { $set: { "Aktif": false, Bitis: Date.now() } }, { upsert: true }).exec();
            let CID = await User.findOne({ userID: uye.id }) || [];
            if (CID) {
                if (CID.Cinsiyet && CID.Isim && CID.Yas) {
                    if (uye && uye.manageable) await uye.setNickname(`${aris?.tags.some(x => uye.user.username.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} ${CID.Isim} | ${CID.Yas}`)
                    if (!aris?.taglıalım || aris?.tags.some(a => uye.user.username.includes(a))) {
                        if (CID.Cinsiyet == "erkek") await uye.setRoles(aris?.manRoles)
                        if (CID.Cinsiyet == "kadın") await uye.setRoles(aris?.womanRoles)
                        if (CID.Cinsiyet == "kayıtsız") await uye.setRoles(aris?.unregisterRoles).catch(x => client._logger.log("Jailler ceza tarayıcısı tarafından tarandı cezası kaldırıldı fakat kayıtsız rolü verilemedi.", "caution"));
                        if (uye && uye.manageable && aris?.tags.some(a => uye.user.username.includes(a))) await uye.roles.add(aris?.tagRole)
                    } else {
                        if (uye && uye.manageable) await uye.setRoles(aris?.unregisterRoles).catch(x => client._logger.log("Jailler ceza tarayıcısı tarafından tarandı fakat isim verisi bulamadığından kayıtsız rolü verilemedi.", "caution"));
                    }
                }
                if (!CID && !CID.Cinsiyet && !CID.Isim && !CID.Yas) await uye.setRoles(aris?.unregisterRoles).catch(x => client._logger.log("Jailler ceza tarayıcısı tarafından tarandı fakat isim verisi bulamadığından kayıtsız rolü verilemedi.", "caution"));
                if (!CID && !CID.Isim && !CID.Yas) await uye.setNickname(`${aris?.tags.some(x => uye.user.username.includes(x)) ? aris?.tags[0] : (aris?.unTag ? aris?.unTag : (aris?.tags[0] || ""))} İsim | Yaş`)

            }
        } else {
            if (uye && uye.manageable) await uye.setRoles(aris?.jailedRole).catch(x => { });
        };
    };
}
