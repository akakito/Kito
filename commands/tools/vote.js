const { RichEmbed } = require("discord.js");
const randomColor = require("randomcolor");

module.exports =
{
    config:
    {
        name: "vote",
        description: "- Starts a voting with the specified options\n \u200b \u200b \u200b - The options can be multiple words",
        usage: "vote [option 1] ; [option 2] ; (option 3) ; (option 4) ; (option 5) ; (option 6) ; (option 7) ; (option 8) ; (option 9) ; (option 10)",
        category: "tools",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

            if (!args[0]) return message.channel.send("Please specify the options separated by semicolons!");

            let options = [];
            let beginning = true;
            let i = 0;
            args.forEach(a =>
            {
                if (options.length >= 10)
                {
                    if (beginning)
                    {
                        options[9] = a;
                        beginning = false;
                    }
                    else options[9] += ` ${a}`;
                }
                else
                {
                    if (beginning)
                    {
                        options[i] = a;
                        beginning = false;
                    }
                    else
                    {
                        if (a === ";")
                        {
                            beginning = true;
                            i++;
                        }
                        else options[i] += ` ${a}`;
                    }
                }
            });

            if (!options[1]) return message.channel.send("Please specify at least 2 options!");

            let numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

            let embed = new RichEmbed()
                .setTitle("Voting")
                .setColor(randomColor())
                .setTimestamp();

            let description = "";
            options.forEach((o, i) =>
            {
                description += `${numbers[i]} - ${o}\n\n`;
            });

            embed.setDescription(description);

            message.channel.send(embed).then(msg => options.forEach((_, i) => msg.react(numbers[i])));
        }
        catch(err)
        {
            console.log(err);
        }
    }
}