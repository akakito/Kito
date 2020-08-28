const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);

module.exports =
{
    config:
    {
        name: "animekiss",
        description: "- You kiss the mentioned member",
        usage: "animekiss [mention]",
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
                "https://tenor.com/view/anime-kiss-love-sweet-gif-5095865",
                "https://tenor.com/view/anime-kiss-romance-gif-5649376",
                "https://tenor.com/view/kiss-love-anime-gif-12837192",
                "https://tenor.com/view/anime-ano-natsu-de-matteru-gif-9670722",
                "https://tenor.com/view/kiss-anime-cute-kawaii-gif-13843260",
                "https://tenor.com/view/anime-couple-peck-cute-kiss-gif-12612515",
                "https://tenor.com/view/golden-time-anime-kiss-gif-6155657",
                "https://tenor.com/view/golden-time-anime-kiss-couple-lovers-gif-6155670",
                "https://tenor.com/view/anime-kissing-kiss-love-gif-10356314",
                "https://tenor.com/view/anime-kiss-cute-couple-tongue-gif-14816388",
                "https://tenor.com/view/kiss-anime-gif-13188942",
                "https://tenor.com/view/anime-kiss-saliva-kissing-passionate-kiss-make-out-gif-15979384",
                "https://tenor.com/view/anime-ano-natsu-de-matteru-gif-9670722",
                "https://tenor.com/view/girl-anime-kiss-gif-11737410",
                "https://tenor.com/view/koi-to-uso-anime-kiss-gif-13344389"
            ]

            if (!args[0]) return message.channel.send("Please mention the member whom you want to kiss!");

            let member = message.mentions.members.first();
            let short = args[0].length < 5;
            let id = (args[0] && !short) ? args[0].slice(3).slice(0, args[0].length - 4) : undefined;

            if ((!id && short) || (!member && ((!id && short) || id))) return message.channel.send("Please mention correctly the member whom you want to kiss!");

            if (member.id === message.author.id) return message.channel.send("You can't kiss yourself!");
            if (member.id === bot.user.id) return message.channel.send("You can't kiss me!");

            message.channel.send(`<@${member.id}>, <@${message.author.id}> kissed you!\n${urls[Math.floor(Math.random() * 15)]}`);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}