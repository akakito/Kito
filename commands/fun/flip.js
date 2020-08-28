const { RichEmbed } = require("discord.js");
const sleep = require("../../util/functions/sleep");

module.exports =
{
    config:
    {
        name: "flip",
        description: "- Flips a coin for you",
        usage: "flip",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            let i = Math.floor(Math.random() * 2);

            let embed1 = new RichEmbed()
                .setColor("#FFA500")
                .setTitle("Flipping.");

            let embed2 = new RichEmbed()
                .setColor("#FFA500")
                .setTitle("Flipping..");

            let embed3 = new RichEmbed()
                .setColor("#FFA500")
                .setTitle("Flipping...");

            let embed4 = new RichEmbed()
                .setColor("#FFA500")
                .setTitle(["Heads", "Tails"][i]);

            message.channel.send(embed1).then(async msg =>
            {
                await sleep(1000);
                msg.edit(embed2).catch(err => {});
                await sleep(1000);
                msg.edit(embed3).catch(err => {});
                await sleep(1000);
                msg.edit(embed4).catch(err => {});
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}