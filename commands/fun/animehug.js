const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);
const { readFileSync } = require("fs");

module.exports =
{
    config:
    {
        name: "animehug",
        description: "- You hug the mentioned member",
        usage: "animehug [mention]",
        category: "fun",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {

            let urls =
            [
                "https://tenor.com/view/teria-wang-kishuku-gakkou-no-juliet-hug-anime-gif-16509980",
                "https://tenor.com/view/hug-anime-love-dragon-loli-gif-9920978",
                "https://tenor.com/view/hug-cuddle-comfort-love-friends-gif-5166500",
                "https://tenor.com/view/hug-anime-gif-11074788",
                "https://tenor.com/view/anime-cheeks-hugs-gif-14106856",
                "https://tenor.com/view/anime-hug-sweet-love-gif-14246498",
                "https://tenor.com/view/hug-anime-love-gif-7324587",
                "https://tenor.com/view/anime-hug-manga-cuddle-japan-gif-10522729",
                "https://tenor.com/view/hug-anime-gif-10195705",
                "https://tenor.com/view/cute-anime-hug-love-come-here-gif-7864716",
                "https://tenor.com/view/anime-cat-girl-catgirl-gif-5690234",
                "https://tenor.com/view/anime-hug-gif-15249774",
                "https://tenor.com/view/hug-loli-cute-cat-neko-gif-5210972",
                "https://tenor.com/view/love-hug-anime-affection-gif-5634630",
                "https://tenor.com/view/sakura-quest-anime-animes-hug-hugging-gif-14721541"
            ]

            if (!args[0]) return message.channel.send("Please mention the member whom you want to hug!");

            let member = message.mentions.members.first();
            let short = args[0].length < 5;
            let id = (args[0] && !short) ? args[0].slice(3).slice(0, args[0].length - 4) : undefined;

            if ((!id && short) || (!member && ((!id && short) || id))) return message.channel.send( "Please mention correctly the member whom you want to hug!");

            if (member.id === message.author.id) return message.channel.send("You can't hug yourself!");
            if (member.id === bot.user.id) return message.channel.send("You can't hug me!");

            message.channel.send(`<@${member.id}>, <@${message.author.id}> hugged you!\n${urls[Math.floor(Math.random() * 15)]}`);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}