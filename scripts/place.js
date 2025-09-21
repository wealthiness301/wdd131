// Footer year + last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Weather calculation
const temp = parseFloat(document.getElementById("temperature").textContent);
const wind = parseFloat(document.getElementById("wind").textContent);

function calculateWindChill(t, s) {
    return (
        35.74 +
        (0.6215 * t) -
        (35.75 * Math.pow(s, 0.16)) +
        (0.4275 * t * Math.pow(s, 0.16))
    ).toFixed(1);
}

let windChillText = "N/A";
if (temp <= 50 && wind > 3) {
    windChillText = calculateWindChill(temp, wind) + " °F";
}
document.getElementById("windchill").textContent = windChillText;
