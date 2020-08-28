const { RichEmbed } = require("discord.js");
const Fortnite = require("fortnite");
const ft = new Fortnite(process.env.FORTNITE_API_KEY);

module.exports =
{
    config:
    {
        name: "fnshop",
        description: "- Sends the current Fortnite item shop",
        usage: "fnshop",
        category: "fortnite",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await ft.store().then(async data=>
            {
                data.sort((a, b) =>
                {
                    return a.vbucks - b.vbucks;
                });

                let i = 0;
                while (true)
                {
                    let min = 25 * i;
                    let max = 25 * (i + 1);

                    if (min > data.length - 1) break;

                    let embed = new RichEmbed()
                        .setColor("#6CC0EF")
                        .setAuthor("Fortnite Item Shop", "https://pm1.narvii.com/7370/91bac9568618da1c93b2f29927d5e006c3a11ee4r1-900-900v2_hq.jpg")
                        .setTitle("Item shop")
                        .setTimestamp();

                    let j;
                    for (j = min; j < max; j++)
                    {
                        if (j > data.length - 1) break;

                        let item = data[j];
                        embed.addField(`**${item.name}**`, `**Rarity:** ${item.rarity}\n**Price:** ${item.vbucks} V-Bucks\n**Image:** [[Click here]](${item.image})`, true);
                    }

                    await message.channel.send(embed);
                    i++;
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}