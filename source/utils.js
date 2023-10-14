function makeID(...args)
{
    return CryptoJS.SHA1(args.join("/")).toString(CryptoJS.enc.Hex);
}

function makeSimpleID(...args)
{
    return args.join("/").replace(/[^a-zA-Z0-9-]/g, "-");
}

function ratingTo10(rating, suffix)
{
    rating = parseFloat(rating);
    suffix ??= "";
    return rating <= 0 ? "-" : (Math.round(rating * 10) + suffix);
}

function ratingTo100(rating, suffix)
{
    rating = parseFloat(rating);
    suffix ??= "";
    return rating <= 0 ? "-" : (Math.round(rating * 100) + suffix);
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