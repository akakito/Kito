const guildModel = require("../../models/guilds");
const emojiRegex = require("emoji-regex");

module.exports =
{
    config:
    {
        name: "removereactrole",
        description: "- Removes the reaction role with the specified emote",
        usage: "removereactrole [emote]",
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
                    let correct = true;

                    let regex = emojiRegex();
                    let res = regex.exec(emote);

                    let origEmote;

                    if (res !== null)
                    {
                        origEmote = res[0];
                        emote = res[0];
                        correct = true;
                    }
                    else if (emote.startsWith("<:"))
                    {
                        origEmote = emote.split(">")[0] + ">";
                        let array = emote.split(">")[0].split(":");
                        emote = array[array.length - 1];

                        if (!bot.emojis.get(emote)) correct = false;
                    }
                    else correct = false;

                    if (!emote) return message.channel.send("Please specify the emote, and mention the role!");
                    if (!correct) return message.channel.send("Please specify correctly the emote!");

                    let index = -1;
                    let role;
                    model.reactroleemotes.forEach((e, i) =>
                    {
                        if (e === emote)
                        {
                            index = i;
                            role = model.reactroleroles[i];
                        }
                    });

                    if (index === -1) return message.channel.send("The specified emote is not in the reaction role system!");

                    model.reactroleemotes.splice(index, 1);
                    model.reactroleroles.splice(index, 1);

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { reactroleemotes: model.reactroleemotes, reactroleroles: model.reactroleroles });

                    return message.channel.send(`Successfully removed the ${origEmote} emote with the <@&${role}> role from the reaction role system!`);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}