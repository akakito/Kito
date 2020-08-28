const { RichEmbed } = require("discord.js");

module.exports =
{
    config:
    {
        name: "donate",
        description: "- Sends a link where you can donate to the bot's owner",
        usage: "donate [amount of dollars]",
        category: "tools",
        accessableby: "Member",
        permissions: ["NOTHING"]
    },
    run: (bot, message, args) =>
    {
        try
        {
            let amount = args[0];

            if (!amount) return message.channel.send("Please specify the amount that you want to donate!");
            if (isNaN(amount)) return message.channel.send("Please specify a valid number for the amount that you want to donate!");
            if (parseInt(amount) <= 0) return message.channel.send("Please specify a valid number for the amount that you want to donate!");

            let embed = new RichEmbed()
                .setColor("#009C15")
                .setAuthor("Donation", "https://cdn.pixabay.com/photo/2018/08/18/12/01/money-3614661_960_720.png")
                .setTitle(`Thanks for donating ${amount}$!`)
                .setDescription(`Click [**here**](https://paypal.me/KristopherCastro/${amount}) to donate ${amount}$`)
                .setTimestamp();

            message.channel.send(embed);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}