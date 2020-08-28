const guildModel = require("../../models/guilds");

module.exports = bot =>
{
    try
    {
        bot.on("messageReactionAdd", async (reaction, user) =>
        {
            await guildModel.findOne({ guildID: reaction.message.guild.id }, (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (reaction.message.id !== model.verificationmessage && reaction.message.id !== model.reactrolemessage) return;
                    if (reaction.message.id === model.verificationmessage && model.verification && model.roles.default && reaction.emoji.name === "✅") return reaction.message.guild.members.get(user.id).addRole(model.roles.default).catch(err =>{});

                    let emotes = [];

                    model.reactroleemotes.forEach(e =>
                    {
                        if (isNaN(e)) emotes.push(e);
                        else
                        {
                            let emote = bot.emojis.get(e);
                            if (emote) emotes.push(emote.name);
                        }
                    });

                    if (emotes.includes(reaction.emoji.name)) reaction.message.guild.members.get(user.id).addRole(model.reactroleroles[emotes.indexOf(reaction.emoji.name)]).catch(err => {});
                }
            });
        });
    }
    catch (err)
    {
        console.log(err);
    }
}