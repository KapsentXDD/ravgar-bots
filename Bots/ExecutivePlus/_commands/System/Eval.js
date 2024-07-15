const { Command } = require("../../../../Global/Structures/Default.Commands");

class Eval extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "JavaScript kodlarını değerlendirir.",
            usage: "eval <kod>",
            category: "System",
            aliases: ["evaluate"],
            enabled: true,
        });
    }

    async onRequest(client, message, args, embed, sistem) {
        try {
            if (!args[0]) return message.channel.send("Kod belirtilmedi!");

            let code = args.join(" ");

            function clean(text) {
                if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
                text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                return text;
            }
            let evaled = clean(await eval(code));
            if (evaled.includes(client.token)) {
                return message.channel.send({ content: "Senin Zürriyetini Sikiyim!"});
            }

            if (!evaled.trim()) return message.channel.send("Eval sonucu boş.");
            if (evaled.length > 4000) {
            
               
                const chunks = evaled.match(/[\s\S]{1,4000}/g);
                for (const chunk of chunks) {
                    message.channel.send(chunk, { code: "js", split: true });
                }
            } else {
                message.channel.send(evaled, { code: "js", split: true });
            }
        } catch (err) {
            message.channel.send(`Hata oluştu: ${err}`, { code: "js" });
        }
    }
}

module.exports = Eval;
