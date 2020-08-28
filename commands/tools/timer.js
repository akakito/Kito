const ms = require("ms");
const formatTime = require("../../util/functions/formatTime");
const userModel = require("../../models/users");

module.exports =
{
    config:
    {
        name: "timer",
        description: "- Starts/stops a timer",
        usage: "timer",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (!model.timer)
                    {
                        message.channel.send(`<@${message.author.id}>, your timer started!`);

                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { timer: Date.now() });
                    }
                    else
                    {
                        let time = Date.now() - model.timer;

                        message.channel.send(`<@${message.author.id}>, your timer stopped at \`${formatTime(time)}\`!`);

                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { timer: null });
                    }
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}