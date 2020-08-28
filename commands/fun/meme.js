const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

module.exports =
{
    config:
    {
        name: "meme",
        description: "- Sends a random meme",
        usage: "meme",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            let embed1 = new RichEmbed()
                .setColor("#FF4501")
                .setAuthor("Reddit", "https://i1.wp.com/www.vectorico.com/wp-content/uploads/2018/08/Reddit-logo.png?fit=900%2C900")
                .setTitle("Fetching your meme, please wait...")
                .setTimestamp();

            message.channel.send(embed1).then(msg =>
            {
                fetch("https://meme-api.herokuapp.com/gimme").then(res => res.json()).then(json =>
                {
                    let embed2 = new RichEmbed()
                        .setColor("#FF4501")
                        .setAuthor("Reddit", "https://i1.wp.com/www.vectorico.com/wp-content/uploads/2018/08/Reddit-logo.png?fit=900%2C900")
                        .setTitle(json.title)
                        .setDescription(`[[Post]](${json.postLink})`)
                        .setImage(json.url)
                        .setFooter(`Posted in r/${json.subreddit}`)
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