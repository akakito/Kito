const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);

module.exports =
{
    config:
    {
        name: "slap",
        description: "- You slap the mentioned member",
        usage: "slap [mention]",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            giphy.random("slap", (err, res) =>
            {
                if (err) console.log(err);

                if (!args[0]) return message.channel.send("Please mention the member whom you want to slap!");

                let member = message.mentions.members.first();
                let short = args[0].length < 5;
                let id = (args[0] && !short) ? args[0].slice(3).slice(0, args[0].length - 4) : undefined;

                if ((!id && short) || (!member && ((!id && short) || id))) return message.channel.send("Please mention correctly the member whom you want to slap!");

                if (member.id === message.author.id) return message.channel.send("You can't slap yourself!");
                if (member.id === bot.user.id) return message.channel.send("You can't slap me!");

                message.channel.send(`<@${member.id}>, <@${message.author.id}> slapped you!\n${res.data.url}`);
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}