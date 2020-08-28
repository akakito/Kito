module.exports =
{
    config:
    {
        name: "ping",
        description: "- Shows the bot's and the API's latency",
        usage: "ping",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            message.channel.send("Pinging...").then(m => m.edit(`PONG! Bot latency: \`${m.createdTimestamp - message.createdTimestamp}ms\`, API latency: \`${Math.round(bot.ping)}ms\``));
        }
        catch(err)
        {
            console.log(err);
        }
    }
}