const mongoose = require("mongoose");

const schema = mongoose.Schema(
{
    guildID: String,
    userID: String,
    xp: Number,
    lvl: Number,
    money: Number,
    bank: Number,
    hours: Number,
    orighours: Number,
    origamount: Number,
    starttime: Number,
    inventory: Object,
    lastrobbed: Number,
    lastdug: Number,
    lastlottery: Number,
    lastdaily: Number,
    lastweekly: Number,
    lastloot: Number,
    fightswon: Number,
    fightslost: Number,
    timer: Number
}, { minimize: false });

module.exports = mongoose.model("users", schema);