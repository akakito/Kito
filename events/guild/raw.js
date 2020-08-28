module.exports = bot =>
{
    try
    {
        bot.on('raw', packet =>
        {
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            const channel = bot.channels.get(packet.d.channel_id);
            if (channel.messages.has(packet.d.message_id)) return;
            channel.fetchMessage(packet.d.message_id).then(message =>
            {
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                const reaction = message.reactions.get(emoji);
                if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
                if (packet.t === 'MESSAGE_REACTION_ADD') bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
                if (packet.t === 'MESSAGE_REACTION_REMOVE') bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
            });
        });
    }
    catch (err)
    {
        console.log(err);
    }
}