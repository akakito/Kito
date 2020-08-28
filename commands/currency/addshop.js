const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "addshop",
        description: "- Adds the mentioned role with the specified price to the shop",
        usage: "addshop [@role] [price]",
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

            if (!id) return message.channel.send("Please mention the role that you want to be purchasable, and specify the role's price!");

            id = id.slice(3, id.length - 1);
            let price = args[1];
            let role = message.mentions.roles.first();
            let rCorrect = (role) ? role.id === id : false;
            let pCorrect = !isNaN(price);

            if (!price)
            {
                if (rCorrect) return message.channel.send("Please specify the role's price!");
                else return message.channel.send("Please mention correctly the role that you want to be purchasable, and specify the role's price!");
            }
            if (!rCorrect)
            {
                if (pCorrect) return message.channel.send("Please mention correctly the role that you want to be purchasable!");
                else return message.channel.send("Please mention correctly the role that you want to be purchasable, and specify correctly the role's price!");
            }
            if (!pCorrect) return message.channel.send("Please specify correctly the role's price!");

            price = parseInt(price);

            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    model.shop[id] = price;

                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { shop: model.shop });

                    message.channel.send(`Successfully added the <@&${id}> role with \`${price} ${model.currency}\` price to the shop!`)
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}