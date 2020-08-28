const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);
const { readFileSync } = require("fs");

module.exports =
{
    config:
    {
        name: "hug",
        description: "- You hug the mentioned member",
        usage: "hug [mention]",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            giphy.random("hug", (err, res) =>
            {
                if (err) console.log(err);

                if (!args[0]) return message.channel.send("Please mention the member whom you want to hug!");

                let member = message.mentions.members.first();
                let short = args[0].length < 5;
                let id = (args[0] && !short) ? args[0].slice(3).slice(0, args[0].length - 4) : undefined;

                if ((!id && short) || (!member && ((!id && short) || id))) return message.channel.send( "Please mention correctly the member whom you want to hug!");

                if (member.id === message.author.id) return message.channel.send("You can't hug yourself!");
                if (member.id === bot.user.id) return message.channel.send("You can't hug me!");

                message.channel.send(`<@${member.id}>, <@${message.author.id}> hugged you!\n${res.data.url}`);
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}