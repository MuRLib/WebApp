function makeID(...args)
{
    return CryptoJS.SHA1(args.join("/")).toString(CryptoJS.enc.Hex);
}

function makeSimpleID(...args)
{
    return args.join("/").replace(/[^a-zA-Z0-9-]/g, "-");
}

function ratingTo100(rating, suffix)
{
    rating = parseFloat(rating);
    suffix ??= "";
    return rating <= 0 ? "-" : (Math.round(rating * 100) + suffix);
}

function ratingTo10(rating, suffix, useCustomFormula)
{
    suffix ??= "";
    rating = parseFloat(rating);

    if (rating <= 0)
    {
        return "-";
    }

    rating *= 10;

    if (useCustomFormula)
    {
        const decimals = rating % 1;
        if (decimals >= 0.75)
        {
            rating = Math.ceil(rating);
        }
        else if (decimals >= 0.25 && rating > 6 && rating < 8)
        {
            rating = Math.floor(rating) + 0.5;
        }
        else
        {
            rating = Math.floor(rating);
        }
    }
    else
    {
        rating = roundAbove(rating, 0.75);
    }

    if (suffix)
    {
        return rating + suffix;
    }
    else
    {
        return rating;
    }
}

function roundAbove(number, threshold)
{
    return (number % 1) < threshold ? Math.floor(number) : Math.ceil(number);
}

function millisecondsToMMSS(milliseconds) {
    // Convert milliseconds to seconds
    let totalSeconds = Math.floor(milliseconds / 1000);
  
    // Calculate minutes and seconds
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
  
    // Ensure that the minutes and seconds are displayed with two digits
    minutes = minutes < 10 ? " " + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
  
    // Return the formatted time as "mm:ss"
    return minutes + ":" + seconds;
  }