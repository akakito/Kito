const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "removecmd",
        description: "- Removes the specified custom command",
        usage: "removecmd [command]",
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

                    if (!command) return message.channel.send("Please specify the command that you want to remove!");
                    if (!model.commands.includes(command)) return message.channel.send("This command doesn't exist!");

                    let index = model.commands.indexOf(command);
                    model.commands.splice(index, 1);
                    model.reactions.splice(index, 1);

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { commands: model.commands, reactions: model.reactions });

                    message.channel.send(`Successfully removed the \`${model.prefix + command}\` command!`);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}