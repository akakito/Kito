const profanities = require("profanities");

module.exports = (message, messageArray) =>
{
    try
    {
        let isProfane = false;

        for (i = 0; i < messageArray.length; i++)
        {
            let m = messageArray[i];

            for (j = 0; j < profanities.length; j++)
            {
                let sw = profanities[j];

                if (m.toLowerCase().replace("@", "a") === sw.toLowerCase())
                {
                    console.log(sw);
                    message.channel.send("Please don't use swearwords!").then(m => m.delete(5000));

                    message.delete();

                    isProfane = true;

                    break;
                }
            }

            if (isProfane) break;
        }

        return isProfane;
    }
    catch(err)
    {
        console.log(err);
    }
};