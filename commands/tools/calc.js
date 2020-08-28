const { evaluate } = require("mathjs");
const { RichEmbed } = require("discord.js");

module.exports =
{
    config:
    {
        name: "calc",
        description: "- Calculates the specified calculation",
        usage: "calc [calculation - e.g. (sin(5) - 98^6) * pi]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            if (!args[0]) return message.channel.send("Please specify the calculation that you want to calculate!");

            let res;
            try
            {
                res = evaluate(args.join(" "));
            }
            catch (err)
            {
                return message.channel.send("Please specify correctly the calculation that you want to calculate!");
            }

            let embed = new RichEmbed()
                .setColor("#4E5D74")
                .setAuthor("Calculator", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Circle-icons-calculator.svg/1200px-Circle-icons-calculator.svg.png")
                .setDescription(`**Input:** \`\`\`js\n${args.join(" ")}\`\`\` \n **Output:** \`\`\`js\n${res}\`\`\``);

            message.channel.send(embed);
        }
        catch (err)
        {
            console.log(err);
        }
    }
}