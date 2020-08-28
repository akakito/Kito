const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

module.exports =
{
    config:
    {
        name: "cat",
        description: "- Sends a random image of a cat",
        usage: "cat",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            let embed1 = new RichEmbed()
                .setColor("#DFDDD0")
                .setAuthor("Cats", "https://mrgreengaming.com/forums/uploads/monthly_2019_09/65191853_2418950468338211_7800901034745790464_n.png.f9f071ddfb029a44b64548ef311c6f4a.png")
                .setTitle("Fetching your cat, please wait...")
                .setTimestamp();

            message.channel.send(embed1).then(msg =>
            {
                fetch("https://api.thecatapi.com/v1/images/search?mime_types=jpg,png").then(res => res.json()).then(json =>
                {
                    let embed2 = new RichEmbed()
                        .setColor("#DFDDD0")
                        .setAuthor("Cats", "https://mrgreengaming.com/forums/uploads/monthly_2019_09/65191853_2418950468338211_7800901034745790464_n.png.f9f071ddfb029a44b64548ef311c6f4a.png")
                        .setTitle(["Here's your cat!", "He wants you!", "She wants you!", "He asks for food!", "She asks for food!"][Math.floor(Math.random() * 5)])
                        .setImage(json[0].url)
                        .setTimestamp();

                    msg.edit(embed2).catch(err => {});
                });
            });

        }
        catch (err)
        {
            console.log(err);
        }
    }
}