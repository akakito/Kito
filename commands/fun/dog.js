const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

module.exports =
{
    config:
    {
        name: "dog",
        description: "- Sends a random image of a dog",
        usage: "dog",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            let embed1 = new RichEmbed()
                .setColor("#DEC874")
                .setAuthor("Dogs", "https://apprecs.org/gp/images/app-icons/300/d2/com.kevingil.dogehub.jpg")
                .setTitle("Fetching your dog, please wait...")
                .setTimestamp();

            message.channel.send(embed1).then(msg =>
            {
                fetch("https://dog.ceo/api/breeds/image/random").then(res => res.json()).then(json =>
                {
                    let embed2 = new RichEmbed()
                        .setColor("#DEC874")
                        .setAuthor("Dogs", "https://apprecs.org/gp/images/app-icons/300/d2/com.kevingil.dogehub.jpg")
                        .setTitle(["Here's your dog!", "He wants you!", "She wants you!", "He asks for a bone!", "She asks for a bone!"][Math.floor(Math.random() * 5)])
                        .setImage(json.message)
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