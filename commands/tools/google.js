const encode = require("strict-uri-encode");

module.exports =
{
    config:
    {
        name: "google",
        description: "- Searches for the specified thing",
        usage: "google [thing you want to search for]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            if (!args[0]) return message.channel.send("Please specify the thing that you want to search for!");

            message.channel.send(`**<https://google.com/search?q=${encode(args.join(" "))}>**`);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}