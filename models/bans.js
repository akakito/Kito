const mongoose = require("mongoose");

const schema = mongoose.Schema(
{
    guildID: String,
    userID: String,
    tag: String,
    reason: String
}, { minimize: false });

module.exports = mongoose.model("bans", schema);