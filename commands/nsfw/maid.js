const akaneko = require("akaneko");

module.exports =
{
    config:
    {
        name: "maid",
        description: "- Sends an NSFW image",
        usage: "maid",
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
                message.channel.send({ files: [akaneko.nsfw.maid()]});
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