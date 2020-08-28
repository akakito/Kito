module.exports =
{
    config:
    {
        name: "say",
        description: "- Sends the message with the bot\n \u200b \u200b \u200b - If you mentioned a channel, then the bot will send the message to that channel",
        usage: "say (#channel) [text]",
        category: "tools",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

            let id = args[0].slice(2).slice(0, -1);

            let channel = message.guild.channels.get(id);

            if (args.length < 1) return message.channel.send("Please specify the message that you want to send with me!");

            if (channel && args.length < 2) return message.channel.send("Please specify the message that you want to send with me!");

            if (channel)
            {
                let text;
                args.forEach((m, i) =>
                {
                    if (i === 1) text = m;
                    else if (i > 1) text += m + " ";
                });

                channel.send(text);
                message.delete();
            }
            else
            {
                let text;
                args.forEach((m, i) =>
                {
                    if (i === 0) text = m;
                    else if (i > 0) text += m + " ";
                });

                message.channel.send(text);
                message.delete();
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}