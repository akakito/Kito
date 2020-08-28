const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "defaultrole",
        description: "- Gives the default role to every member",
        usage: "defaultrole",
        category: "tools",
        accessableby: "Server Owner",
        permissions: ["SERVER_OWNER"]
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
                    if (!model.roles.default || !message.guild.roles.get(model.roles.default)) return message.channel.send("The default role isn't set!");

                    message.guild.members.forEach(m =>
                    {
                        if (!m.user.bot) m.addRole(model.roles.default).catch(err => {});
                    });

                    message.channel.send(`Successfully gave the <@&${model.roles.default}> role to every member!`);
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}