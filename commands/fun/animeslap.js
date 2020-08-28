const giphy = require("giphy-api")(process.env.GIPHY_API_KEY);

module.exports =
{
    config:
    {
        name: "animeslap",
        description: "- You slap the mentioned member",
        usage: "animeslap [mention]",
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
                "https://tenor.com/view/slap-handaseishuu-narukotoishi-barakamonanime-barakamon-gif-5509136",
                "https://tenor.com/view/mad-angry-pissed-upset-slap-gif-4436362",
                "https://tenor.com/view/when-you-cant-accept-reality-slap-anime-gif-14694312",
                "https://tenor.com/view/slap-anime-cartoon-japanese-nyan-koi-gif-7859254",
                "https://tenor.com/view/anime-slap-hit-hurt-angry-gif-12396060",
                "https://tenor.com/view/anime-slap-slapping-smacking-heavens-lost-property-gif-5738394",
                "https://tenor.com/view/mm-emu-emu-anime-slap-strong-gif-7958720",
                "https://tenor.com/view/anime-smash-lesbian-punch-wall-gif-4790446",
                "https://tenor.com/view/anime-slap-gif-12946466",
                "https://tenor.com/view/anime-slap-gif-10426943",
                "https://tenor.com/view/exultant-anime-slap-classroom-girl-gif-16881889",
                "https://tenor.com/view/anime-slap-dog-gif-13278667",
                "https://tenor.com/view/anime-slap-girl-boy-gif-7919028",
                "https://tenor.com/view/anime-hair-slap-nerd-mad-angry-gif-15285820",
                "https://tenor.com/view/anime-slap-hit-gif-16121405"
            ]

            if (!args[0]) return message.channel.send("Please mention the member whom you want to slap!");

            let member = message.mentions.members.first();
            let short = args[0].length < 5;
            let id = (args[0] && !short) ? args[0].slice(3).slice(0, args[0].length - 4) : undefined;

            if ((!id && short) || (!member && ((!id && short) || id))) return message.channel.send("Please mention correctly the member whom you want to slap!");

            if (member.id === message.author.id) return message.channel.send("You can't slap yourself!");
            if (member.id === bot.user.id) return message.channel.send("You can't slap me!");

            message.channel.send(`<@${member.id}>, <@${message.author.id}> slapped you!\n${urls[Math.floor(Math.random() * 15)]}`);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}