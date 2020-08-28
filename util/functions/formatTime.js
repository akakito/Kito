module.exports = time =>
{
    let result = "";
    if (Math.floor(time / 86400000) > 0)
    {
        if (Math.floor(time / 86400000) === 1)
        {
            result += `${Math.floor(time / 86400000)} day `;
        }
        else
        {
            result += `${Math.floor(time / 86400000)} days `;
        }
    }
    if (Math.floor(time % 86400000 / 3600000) > 0)
    {
        if (Math.floor(time % 86400000 / 3600000) === 1)
        {
            result += `${Math.floor(time % 86400000 / 3600000)} hour `;
        }
        else
        {
            result += `${Math.floor(time % 86400000 / 3600000)} hours `;
        }
    }
    if (Math.floor(time % 86400000 % 3600000 / 60000) > 0)
    {
        if (Math.floor(time % 86400000 % 3600000 / 60000) === 1)
        {
            result += `${Math.floor(time % 86400000 % 3600000 / 60000)} minute `;
        }
        else
        {
            result += `${Math.floor(time % 86400000 % 3600000 / 60000)} minutes `;
        }
    }
    if (Math.floor(time % 86400000 % 3600000 % 60000 / 1000) > 0)
    {
        if (Math.floor(time % 86400000 % 3600000 % 60000 / 1000) === 1)
        {
            result += `${Math.floor(time % 86400000 % 3600000 % 60000 / 1000)} second `;
        }
        else
        {
            result += `${Math.floor(time % 86400000 % 3600000 % 60000 / 1000)} seconds `;
        }
    }

    return result.trim();
}