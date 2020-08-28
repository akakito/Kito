const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "addcmd",
        description: "- Adds the specified custom command\n \u200b \u200b \u200b - The bot will respond to the specified command with the specified message",
        usage: "addcmd [command (only one word)] [response (it can be multiple words)]",
        category: "custom command tools",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

                    let command = args[0];
                    let reaction = (args[1]) ? args.slice(1).join(" ") : undefined;

                    if (!command) return message.channel.send("Please specify the command and the response for it!");
                    if (!reaction) return message.channel.send("Please specify the response for the command!");
                    if (model.commands.includes(command) || bot.commandNames.includes(command)) return message.channel.send("This command is already existing!");

                    model.commands.push(command);
                    model.reactions.push(reaction);

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { commands: model.commands, reactions: model.reactions });

                    message.channel.send(`Successfully added the \`${model.prefix + command}\` command with this response:\n\`\`\`\n${reaction}\n\`\`\``);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}