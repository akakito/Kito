const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "enable",
        description: "- Enables a command",
        usage: "enable [command]",
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

            if (!command) return message.channel.send("Please specify the command that you want to enable!");
            if (!bot.commandNames.includes(command)) return message.channel.send("This command doesn't exist!");

            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (!model.disabled.includes(command)) return message.channel.send("This command isn't disabled!");

                    model.disabled.splice(model.disabled.indexOf(command));

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { disabled: model.disabled });

                    message.channel.send(`Successfully enabled the \`${command}\` command!`);
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}