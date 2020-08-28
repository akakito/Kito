const guildModel = require("../../models/guilds");
const userModel = require("../../models/users");
const banModel = require("../../models/users");
const muteModel = require("../../models/users");

module.exports = bot =>
{
    bot.on("guildMemberRemove", async member =>
    {
        try
        {
            await guildModel.findOne({ guildID: member.guild.id }, async (err, model) =>
            {
                if (err) console.log(err);

                if (member.id == bot.user.id) return;

                let message = `Goodbye <@${member.id}>!`

                let leaveChannel = member.guild.channels.get(model.channels.leave);
                if (!leaveChannel) return member.guild.owner.send(`Please set the leave channel with the ${model.prefix}setup command!`);

                leaveChannel.send(message);

                await userModel.deleteOne({ guildID: member.guild.id, userID: member.id });
                await banModel.deleteOne({ guildID: member.guild.id, userID: member.id });
                await muteModel.deleteOne({ guildID: member.guild.id, userID: member.id });
            });
        }
        catch(err)
        {
            console.log(err);
        }
    });
}
