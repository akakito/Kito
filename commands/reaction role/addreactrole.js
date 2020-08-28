const guildModel = require("../../models/guilds");
const emojiRegex = require("emoji-regex");

module.exports =
{
    config:
    {
        name: "addreactrole",
        description: "- Adds the mentioned role to the reaction role system with the specified emote",
        usage: "addreactrole [emote] [@role]",
        category: "reaction role",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    let emote = args[0];
                    let id = args[1].slice(3, args[1].length - 1);
                    let role = message.mentions.roles.first();
                    let eCorrect = true;
                    let rCorrect = (role) ? role.id === id : false;

                    let regex = emojiRegex();
                    let res = regex.exec(emote);

                    let origEmote;

                    if (res !== null)
                    {
                        origEmote = res[0];
                        emote = res[0];
                        eCorrect = true;
                    }
                    else if (emote.startsWith("<:"))
                    {
                        origEmote = emote.split(">")[0] + ">";
                        let array = emote.split(">")[0].split(":");
                        emote = array[array.length - 1];

                        if (!bot.emojis.get(emote)) eCorrect = false;
                    }
                    else eCorrect = false;

                    if (!emote) return message.channel.send("Please specify the emote, and mention the role!");
                    if (!id)
                    {
                        if (eCorrect) return message.channel.send("Please mention the role!");
                        else return message.channel.send("Please specify correctly the emote, and mention the role!");
                    }
                    if (!rCorrect)
                    {
                        if (eCorrect) return message.channel.send("Please mention correctly the role!");
                        else return message.channel.send("Please specify correctly the emote, and mention correctly the role!");
                    }
                    if (!eCorrect) return message.channel.send("Please specify correctly the emote!");

                    let exist = false;
                    model.reactroleemotes.forEach(r => { if (r.emote === emote) exist = true; });
                    model.reactroleroles.forEach(r => { if (r.role === id) exist = true; });

                    if (exist) return message.channel.send("The specified emote or the mentioned role is already in the reaction role system!");

                    model.reactroleemotes.push(emote);
                    model.reactroleroles.push(id);

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { reactroleemotes: model.reactroleemotes, reactroleroles: model.reactroleroles });

                    return message.channel.send(`Successfully added the ${origEmote} emote with the <@&${id}> role to the reaction role system!`);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}