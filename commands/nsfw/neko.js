const akaneko = require("akaneko");

module.exports =
{
    config:
    {
        name: "neko",
        description: "- Sends an NSFW image",
        usage: "neko",
        category: "nsfw",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            if (message.channel.nsfw === true)
            {
                message.channel.send({ files: [akaneko.neko()]});
            }
            else
            {
                message.channel.send("This is not a NSFW channel!");
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}