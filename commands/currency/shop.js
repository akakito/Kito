const { RichEmbed, MessageCollector } = require("discord.js");
const userModel = require("../../models/users");
const guildModel = require("../../models/guilds");

module.exports =
{
    config:
    {
        name: "shop",
        description: "- Shows the server's role shop, where you can buy a role",
        usage: "shop",
        category: "currency",
        accessableby: "Member",
        permissions: ["NOTHING"]
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
                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err1, model1) =>
                    {
                        if (err1) console.log(err1);

                        if (model1 !== null)
                        {
                            let roles = [];
                            let prices = [];
                            for (role in model.shop)
                            {
                                if (!model.shop.hasOwnProperty(role)) continue;

                                if (message.guild.roles.get(role))
                                {
                                    roles.push(role);
                                    prices.push(model.shop[role]);
                                }
                                else
                                {
                                    delete model.shop[role];
                                    await guildModel.findOneAndUpdate({ guildID: message.guild.id }, { shop: model.shop });
                                }
                            }

                            let i;
                            for (i = 0; i < prices.length; i++)
                            {
                                let j;
                                for (j = i + 1; j < prices.length; j++)
                                {
                                    if (prices[j] < prices[i])
                                    {
                                        let temp = prices[i];
                                        prices[i] = prices[j];
                                        prices[j] = temp;

                                        temp = roles[i];
                                        roles[i] = roles[j];
                                        roles[j] = temp;
                                    }
                                }
                            }

                            let description = `**Type** \`${model.prefix}select [role's number]\` **if you want to buy a role**\n**Type** \`${model.prefix}cancel\` **if you want to cancel the buying**\n\n`;
                            roles.forEach((r, i) =>
                            {
                                description += `${i + 1}.) <@&${r}> - \`${prices[i]} ${model.currency}\`\n`
                            });

                            let embed = new RichEmbed()
                                .setColor("#FFF2CF")
                                .setTitle("\\🏪Shop")
                                .setDescription(description)
                                .setTimestamp();

                            message.channel.send(embed).then(_ =>
                            {
                                const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id && (m.content.startsWith(`${model.prefix}select`) ||  m.content === `${model.prefix}cancel`), { time: 10000 });

                                collector.on("collect", async m =>
                                {
                                    if (m.content === `${model.prefix}cancel`) collector.stop("time");
                                    else if (m.content.startsWith(`${model.prefix}select`))
                                    {
                                        let mArray = m.content.split(" ").filter(str => { return /\S/.test(str); });
                                        if (!mArray[1]) collector.stop("notDefined");
                                        else if (isNaN(mArray[1])) collector.stop("nan");
                                        else collector.stop(`good`);
                                    }
                                });
                                collector.on("end", async (collected, reason) =>
                                {
                                    switch (reason)
                                    {
                                        case "time":
                                            message.channel.send("Shopping canceled...");
                                            break;

                                        case "notDefined":
                                            message.channel.send("You didn't define the number of the role! Shopping canceled...");
                                            break;

                                        case "nan":
                                            message.channel.send("You didn't define a valid number for the number of the role! Shopping canceled...");
                                            break;

                                        case "good":
                                            let msg = collected.first();
                                            let number = parseInt(msg.content.split(" ").filter(str => { return /\S/.test(str); })[1]);

                                            if (number <= 0) return message.channel.send("You didn't define a valid number for the number of the role! Shopping canceled...");
                                            if (number > roles.length) return message.channel.send("The number is bigger than the last role's number! Shopping canceled...");

                                            number -= 1;

                                            let role = roles[number];
                                            let price = prices[number];

                                            if (model1.money < price) return message.channel.send("You don't have enough money for that role! Shopping canceled...");
                                            if (message.member.roles.get(role)) return message.channel.send("You already have that role! Shopping canceled...");

                                            model1.money -= price;
                                            message.member.addRole(role).catch(err =>{});

                                            await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money });

                                            message.channel.send(`Successfully bought the <@&${role}> role for \`${price} ${model.currency}\`!`)
                                            break;

                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    }
}