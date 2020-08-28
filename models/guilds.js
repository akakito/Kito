const mongoose = require("mongoose");

const schema = mongoose.Schema(
{
    guildID: String,
    guildName: String,
    prefix: String,
    roles: Object,
    channels: Object,
    profanityfilter: Boolean,
    commands: Array,
    reactions: Array,
    currency: String,
    shop: Object,
    disabled: Array,
    degreetype: String,
    botchannel: Boolean,
    musiccommands: Boolean,
    musicvoice: Boolean,
    verification: Boolean,
    verificationmessage: String,
    reactroleemotes: Array,
    reactroleroles: Array,
    reactrolemessage: String,
    reactrolechannel: String,
    dj: Boolean,
    logs: Boolean
}, { minimize: false });

module.exports = mongoose.model("guilds", schema);