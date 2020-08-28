const { MessageCollector } = require("discord.js");
const sleep = require("../../util/functions/sleep");
const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");

module.exports =
{
    config:
    {
        name: "fight",
        description: "- Starts a fight with the mentioned member\n \u200b \u200b \u200b - !punch: Attacks the enemy\n \u200b \u200b \u200b - !defend: Raises your defend\n \u200b \u200b \u200b - !end: Ends the fight",
        usage: "fight [@member]",
        category: "fun",
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
                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, model1) =>
                    {
                        if (err) console.log(err);

                        if (model1 !== null)
                        {
                            if (!args[0]) return message.channel.send("Please mention the member whom you want to fight!");

                            let id = args[0].slice(3, args[0].length - 1);
                            let member = message.mentions.members.first();

                            if (!member || member.id !== id) return message.channel.send("Please mention correctly the member whom you want to fight!");
                            if (member.user.bot) return message.channel.send("You can't fight against a bot!");
                            if (member.id === message.author.id) return message.channel.send("You can't fight against yourself!");

                            if (bot.fight.includes(message.author.id) || bot.fight.includes(member.id))
                            {
                                if (bot.fight.includes(message.author.id) && bot.fight.includes(member.id)) return message.channel.send("You and the mentioned member are in a fight already!");
                                else if (bot.fight.includes(message.author.id)) return message.channel.send("You are in a fight already!");
                                else return message.channel.send("The mentioned member is in a fight already!");
                            }

                            await userModel.findOne({ guildID: message.guild.id, userID: member.id }, async (err, model2) =>
                            {
                                if (err) console.log(err);

                                if (model1 !== null)
                                {

                                    bot.fight.push(message.author.id);
                                    bot.fight.push(member.id);

                                    let h1 = 100;
                                    let h2 = 100;
                                    let d1 = 0;
                                    let d2 = 0;

                                    let current = [true, false][Math.floor(Math.random() * 2)];

                                    while (h1 > 0 && h2 > 0)
                                    {
                                        let responsed = false;
                                        let p = (current) ? message.author.id : member.id;

                                        await message.channel.send(`<@${p}>, what do you want to do? \`${model.prefix}punch\`, \`${model.prefix}defend\` or \`${model.prefix}end\`?`);

                                        const collector = new MessageCollector(message.channel, m => m.author.id === p && (m.content.toLowerCase() === `${model.prefix}punch` || m.content.toLowerCase() === `${model.prefix}defend` || m.content.toLowerCase() === `${model.prefix}end`), { time: 20000 });

                                        collector.on("collect", async m =>
                                        {
                                            if (m.content === `${model.prefix}end`) collector.stop("time");
                                            else if (m.content === `${model.prefix}punch`) collector.stop("punch");
                                            else if (m.content === `${model.prefix}defend`) collector.stop("defend");
                                        });

                                        collector.on("end", (_, reason) =>
                                        {
                                            if (reason === "time")
                                            {
                                                message.channel.send("Fight cancelled...");
                                                h1 = 0;
                                                h2 = 0;
                                            }
                                            else if (reason === "punch")
                                            {
                                                let values = [Math.floor(Math.random() * 19) + 1, Math.floor(Math.random() * 19) + 21,  Math.floor(Math.random() * 19) + 41];
                                                let rand = Math.floor(Math.random() * 99);
                                                let i = (rand < 50) ? ((rand < 20) ? 2 : 1) : 0;

                                                let defend = Math.round(((current) ? d1 : d2) / 10);
                                                let damage = (defend < values[i]) ? values[i] - defend : values[i];

                                                if (current) h2 -= damage;
                                                else h1 -= damage;

                                                if (h1 > 0 && h2 > 0) message.channel.send(`<@${p}> dealt ${damage} damage to <@${(!current) ? message.author.id : member.id}>!\n**${message.author.username}** - **HP:** \`${h1}\` **Defend:** \`${d1}\`\n**${member.user.username}** - **HP:** \`${h2}\` **Defend:** \`${d2}\``);
                                            }
                                            else if (reason === "defend")
                                            {
                                                let values = [Math.floor(Math.random() * 19) + 1, Math.floor(Math.random() * 19) + 21,  Math.floor(Math.random() * 19) + 41];
                                                let rand = Math.floor(Math.random() * 99);
                                                let i = (rand < 50) ? ((rand < 20) ? 2 : 1) : 0;

                                                let defend = values[i];

                                                if (current) d1 += defend;
                                                else d2 += defend;

                                                message.channel.send(`<@${p}> increased his/her defend with ${defend}!\n**${message.author.username}** - **HP:** \`${h1}\` **Defend:** \`${d1}\`\n**${member.user.username}** - **HP:** \`${h2}\` **Defend:** \`${d2}\``);
                                            }
                                            current = !current;
                                            responsed = true;
                                        });

                                        while (!responsed) { await sleep(250); }
                                    }



                                    if (h1 <= 0 && h2 > 0)
                                    {
                                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: member.id }, { money: model2.money + h2, xp: model2.xp + h2, fightswon: model2.fightswon + 1 });
                                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { fightslost: model1.fightslost + 1 });
                                        message.channel.send(`<@${member.id}> won with ${h2} HP and ${d2} defend! He/she earned \`${h2} XP\` and \`${h2} ${model.currency}\`!`);
                                    }
                                    else if (h1 > 0 && h2 <= 0)
                                    {
                                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { money: model1.money + h1, xp: model1.xp + h1, fightswon: model1.fightswon + 1 });
                                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: member.id }, { fightslost: model2.fightslost + 1 });
                                        message.channel.send(`<@${message.author.id}> won with ${h1} HP and ${d1} defend!  He/she earned \`${h1} XP\` and \`${h1} ${model.currency}\`!`);
                                    }

                                    bot.fight.splice(bot.fight.indexOf(message.author.id), 1);
                                    bot.fight.splice(bot.fight.indexOf(member.id), 1);
                                }
                            });
                        }
                    });
                }
            });
        }
        catch (err)
        {
            console.log(err);
        }
    }
}