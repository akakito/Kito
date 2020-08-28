const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "disable",
        description: "- Disables a command",
        usage: "disable [command]",
        category: "tools",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

            let command = args[0];

            if (!command) return message.channel.send("Please specify the command that you want to disable!");
            if (!bot.commandNames.includes(command)) return message.channel.send("This command doesn't exist!");

            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (model.disabled.includes(command)) return message.channel.send("This command is already disabled!");

                    model.disabled.push(command);

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { disabled: model.disabled });

                    message.channel.send(`Successfully disabled the \`${command}\` command!`);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}