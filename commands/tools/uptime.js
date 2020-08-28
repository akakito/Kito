const formatTime = require("../../util/functions/formatTime");

module.exports =
{
    config:
    {
        name: "uptime",
        description: "- Shows the bot's uptime",
        usage: "uptime",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            message.channel.send(`I've been online for: ${formatTime(bot.uptime)}`);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}