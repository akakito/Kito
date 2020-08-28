const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "removeshop",
        description: "- Removes the mentioned role from the shop",
        usage: "removeshop [@role]",
        category: "currency",
        accessableby: "Administrator permission",
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) =>
    {
        try
        {
            if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have permission to use this command!");

            let id = args[0];

            if (!id) return message.channel.send("Please mention the role that you want to remove from the shop!");

            id = id.slice(3, id.length - 1);
            let role = message.mentions.roles.first();
            let rCorrect = (role) ? role.id === id : false;

            if (!rCorrect) return message.channel.send("Please mention correctly the role that you want to remove from the shop!");

            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    if (!model.shop.hasOwnProperty(id)) return message.channel.send(`The <@&${id}> role is not in the shop!`);

                    delete model.shop[id];

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { shop: model.shop });

                    message.channel.send(`Successfully removed the <@&${id}> role from the shop!`)
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}