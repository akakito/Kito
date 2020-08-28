const akaneko = require("akaneko");

module.exports =
{
    config:
    {
        name: "femdom",
        description: "- Sends an NSFW image",
        usage: "femdom",
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
                message.channel.send({ files: [akaneko.nsfw.femdom()]});
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