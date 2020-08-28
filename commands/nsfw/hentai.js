const akaneko = require("akaneko");

module.exports =
{
    config:
    {
        name: "hentai",
        description: "- Sends an NSFW image",
        usage: "hentai",
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
                message.channel.send({ files: [akaneko.nsfw.hentai()]});
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