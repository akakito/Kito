const { RichEmbed, Collection } = require("discord.js");
const Fortnite = require("fortnite");
const ft = new Fortnite(process.env.FORTNITE_API_KEY);
const platforms = new Collection().set("pc", "pc").set("xbox1", "xb1").set("ps4", "psn");

module.exports =
{
    config:
    {
        name: "fnstats",
        description: "- Shows the specified stats about the specified player",
        usage: "fnstats [username] [pc|xbox1|ps4] [solo|duo|squad|lifetime]",
        category: "fortnite",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            let username = args[0];

            let platform = args[1];
            let pcorrect = (platform) ? ["pc", "xbox1", "ps4"].includes(platform.toLowerCase()) : false;

            let type = args[2];
            let tcorrect = (type) ? ["solo", "duo", "squad", "lifetime"].includes(type.toLowerCase()) : false;

            if (!username) return message.channel.send("Please specify the username, the platform (pc/ps4/xbox1) and the type (solo/duo/squad/lifetime)!");
            if (!platform) return message.channel.send("Please specify the platform (pc/ps4/xbox1) and the type (solo/duo/squad/lifetime)!");
            if (!pcorrect && !type) return message.channel.send("Please specify the platform correctly (pc/ps4/xbox1) and specify the type (solo/duo/squad/lifetime)!");
            if (!pcorrect && !tcorrect) return message.channel.send("Please specify correctly the platform (pc/ps4/xbox1) and the type (solo/duo/squad/lifetime)!");
            if (!pcorrect) return message.channel.send("Please specify the platform correctly (pc/ps4/xbox1)!");
            if (pcorrect && !type) return message.channel.send("Please specify the type (solo/duo/squad/lifetime)!");
            if (!tcorrect) return message.channel.send("Please specify correctly the type (solo/duo/squad/lifetime)!");

            await ft.user(username, platforms.get(platform)).then(data =>
            {
                if (data.error === "Player Not Found") return message.channel.send("Please specify a valid username!");

                let stats = data.stats[type];
                let embed = new RichEmbed()
                    .setColor("#6CC0EF")
                    .setTitle(`${data.username}'s ${type} stats`)
                    .setAuthor("Fortnite Stats", "https://pm1.narvii.com/7370/91bac9568618da1c93b2f29927d5e006c3a11ee4r1-900-900v2_hq.jpg")
                    .setTimestamp();

                switch (type)
                {
                    case "solo":
                        embed.setDescription(`**KD:** ${stats.kd}\n**Matches:** ${stats.matches}\n**Kills:** ${stats.kills}\n**Kills per match:** ${stats.kills_per_match}\n**Wins:** ${stats.wins}\n**Top 3:** ${stats.top_3}\n**Top 5:** ${stats.top_5}\n**Top 6:** ${stats.top_6}\n**Top 12:** ${stats.top_12}\n**Top 25:** ${stats.top_25}`);
                        break;

                    case "duo":
                        embed.setDescription(`**KD:** ${stats.kd}\n**Matches:** ${stats.matches}\n**Kills:** ${stats.kills}\n**Kills per match:** ${stats.kills_per_match}\n**Wins:** ${stats.wins}\n**Top 3:** ${stats.top_3}\n**Top 5:** ${stats.top_5}\n**Top 6:** ${stats.top_6}\n**Top 12:** ${stats.top_12}\n**Top 25:** ${stats.top_25}`);
                        break;

                    case "squad":
                        embed.setDescription(`**KD:** ${stats.kd}\n**Matches:** ${stats.matches}\n**Kills:** ${stats.kills}\n**Kills per match:** ${stats.kills_per_match}\n**Wins:** ${stats.wins}\n**Top 3:** ${stats.top_3}\n**Top 5:** ${stats.top_5}\n**Top 6:** ${stats.top_6}\n**Top 12:** ${stats.top_12}\n**Top 25:** ${stats.top_25}`);
                        break;

                    case "lifetime":
                        embed.setDescription(`**KD:** ${stats.kd}\n**Matches:** ${stats.matches}\n**Kills:** ${stats.kills}\n**Wins:** ${stats.wins}\n**Top 3:** ${stats.top_3}\n**Top 5:** ${stats.top_5}\n**Top 6:** ${stats.top_6}\n**Top 12:** ${stats.top_12}\n**Top 25:** ${stats.top_25}`);
                        break;
                }

                message.channel.send(embed);
            }).catch(err => console.log(err));

        }
        catch (err)
        {
            console.log(err);
        }
    }
}