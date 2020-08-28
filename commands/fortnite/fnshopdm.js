const { RichEmbed } = require("discord.js");
const Fortnite = require("fortnite");
const ft = new Fortnite(process.env.FORTNITE_API_KEY);

module.exports =
{
    config:
    {
        name: "fnshopdm",
        description: "- Sends the current Fortnite item shop with images to DM",
        usage: "fnshopdm",
        category: "fortnite",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await ft.store().then(data =>
            {
                data.sort((a, b) =>
                {
                    return b.vbucks - a.vbucks;
                });


                data.forEach(item =>
                {
                    let embed = new RichEmbed()
                        .setColor("#6CC0EF")
                        .setAuthor("Fortnite Item Shop", "https://pm1.narvii.com/7370/91bac9568618da1c93b2f29927d5e006c3a11ee4r1-900-900v2_hq.jpg")
                        .setTitle(`**${item.name}**`)
                        .setDescription(`**Rarity:** ${item.rarity}\n**Price:** ${item.vbucks} V-Bucks`)
                        .setImage(item.image)
                        .setTimestamp();

                    message.member.send(embed);
                });

                message.channel.send("I wrote in DM!");
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}