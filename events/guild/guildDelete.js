const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");
const banModel = require("../../models/bans");
const muteModel = require("../../models/mutes");

module.exports = bot =>
{
    try
    {
        bot.on("guildDelete", async guild =>
        {
            await guildModel.deleteOne({ guildID: guild.id });
            await userModel.deleteMany({ guildID: guild.id });
            await banModel.deleteMany({ guildID: guild.id });
            await muteModel.deleteMany({ guildID: guild.id });
        });
    }
    catch (err)
    {
        console.log(err);
    }
}