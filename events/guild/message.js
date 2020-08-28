const { readFileSync } = require("fs");
const pf = require("../../util/functions/profanityFilter");
const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");

module.exports = bot =>
{
    bot.on("message", async message =>
    {
        try
        {
            const { me } = JSON.parse(readFileSync("./data/botconfig.json"));

            if (message.author.bot) return;

            if (!message.guild) return message.channel.send("Please don't send messages in DM!");

            await guildModel.findOne({ guildID: message.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (model !== null)
                {
                    let isCommand = false;
                    let messageArray = message.content.split(" ");

                    messageArray = messageArray.filter(str => { return /\S/.test(str); });

                    if (model.profanityfilter && pf(message, messageArray)) return;

                    if (message.content.startsWith(model.prefix, 0)) isCommand = true;

                    if (isCommand)
                    {
                        let command = messageArray[0].slice(model.prefix.length).toLowerCase();
                        let commandFile = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
                        let args = messageArray.slice(1);

                        if (!message.guild.me.hasPermission("ADMINISTRATOR"))
                        {
                            message.channel.send("I don't have an Administrator permission!");
                            return message.guild.owner.send("Please give me an Administrator permission, or I won't be abel to operate on your server!")
                        }

                        if (bot.active || (command === "activate" && message.author.id === me))
                        {
                            if (commandFile && !model.disabled.includes(command))
                            {
                                if (model.botchannel && !message.guild.channels.get(model.channels.bot))
                                {
                                    message.channel.send("The bot channel isn't set!");
                                    return message.guild.owner.send(`Please set the bot channel with the ${model.prefix}setup command!`);
                                }

                                if (model.musiccommands && !message.guild.channels.get(model.channels.musicText))
                                {
                                    message.channel.send("The music commands channel isn't set!");
                                    return message.guild.owner.send(`Please set the bot channel with the ${model.prefix}setup command!`);
                                }

                                let isMusic = message.channel.id === model.channels.musicText;
                                let isMusicCommand = ["clearqueue", "delete", "forward", "loop", "loopqueue", "nowplaying", "pause", "play", "queue", "repeat", "resume", "rewind", "seek", "shuffle", "skip", "skipto", "stop", "volume"].includes(command);
                                let isBot = message.channel.id === model.channels.bot;
                                if (model.musiccommands && isMusic && isMusicCommand) commandFile.run(bot, message, args);
                                else if (model.botchannel && isBot && (!model.musiccommands || (model.musiccommands && !isMusicCommand))) commandFile.run(bot, message, args);
                                else if ((!model.botchannel && !model.musiccommands) || (!model.botchannel && (model.musiccommands && !isMusic && !isMusicCommand))) commandFile.run(bot, message, args);
                            }
                            else
                            {
                                let cmdIndex = model.commands.indexOf(command);

                                if (cmdIndex !== -1)
                                {
                                    if (model.botchannel && !message.guild.channels.get(model.channels.bot))
                                    {
                                        message.channel.send("The bot channel isn't set!");
                                        return message.guild.owner.send(`Please set the bot channel with the ${model.prefix}setup command!`);
                                    }

                                    if (model.botchannel && message.channel.id === model.channels.bot) message.channel.send(model.reactions[cmdIndex]);
                                    else message.channel.send(model.reactions[cmdIndex]);
                                }
                            }
                        }
                        else
                        {
                            if ((model.botchannel && message.channel.id === model.channels.bot) || (model.musiccommands && message.channel.id === model.channels.musicText))
                            {
                                if (commandFile) message.channel.send("The bot is under maintenance, please be patient!");
                                else
                                {
                                    let cmdIndex = model.commands.indexOf(command);

                                    if (cmdIndex !== -1)
                                    {
                                        message.channel.send("The bot is under maintenance, please be patient!");
                                    }
                                }
                            }
                        }
                    }

                    await userModel.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err1, model1) =>
                    {
                        if (err1) console.log(err1);

                        let plusXP = Math.floor(Math.random() * 10) + 5;
                        let xp = model1.xp + plusXP;
                        let lvl = Math.floor(xp/1000) + 1;

                        if (lvl > model1.lvl)
                        {
                            message.author.send(`<@${message.author.id}>, you leveled up in the \`${message.guild.name}\` server to level ${lvl}!`);
                        }

                        await userModel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { xp: xp, lvl: lvl });
                    });
                }
            });
        }
        catch(err)
        {
            console.log(err);
        }
    });
}