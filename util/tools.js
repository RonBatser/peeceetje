const MONTH_NAMES = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
];

const SHORT_MONTH_NAMES = [
    "jan.", "feb.", "maart", "apr.", "mei", "juni",
    "juli", "aug.", "sept.", "okt.", "nov.", "dec."
];

/**
 * Pad-Left / PadStart Node.JS < ver.8.0.0.0
 * @param n
 * @param width
 * @param z
 * @returns {string}
 */
function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/**
 * Formats date in "dd/mm/YYYY" format
 * @param date
 * @returns {string} formatted date in "dd/mm/YYYY" format
 */
function formattedDate(date) {
    return pad(date.getDate(), 2)
        + "/" + pad(date.getMonth() + 1, 2)
        + "/" + date.getFullYear();
}

/**
 * Formats date in "YYYY-mm-dd" format for datetime attribute of HTML <time> tag (W3C standard)
 * @param date
 * @returns {string} formatted date in "YYYY-mm-dd" format
 */
function formattedDatetimeDate(date) {
    return date.getFullYear()
        + "-" + pad(date.getMonth() + 1, 2)
        + "-" + pad(date.getDate(), 2);
}

/**
 * Formats datetime in "YYYY-mm-dd HH:mm" format for datetime attribute of HTML <time> tag (W3C standard)
 * @param date
 * @returns {string} formatted datetime in "YYYY-mm-dd HH:mm" format
 */
function formattedDatetime(date) {
    let formattedDate = formattedDatetimeDate(date);
    var time = pad(eventDate.getHours(), 2) + ":" + pad(eventDate.getMinutes(), 2);
    return formattedDate + " " + time;
}

/**
 * Formats date in "YYYY shortMonthName dd" format
 * @param date
 * @returns {string} formatted date in "YYYY shortMonthName dd" format
 */
function formattedShortDate(date) {
    return date.getDate()
        + " " + SHORT_MONTH_NAMES[date.getMonth()]
        + " " + date.getFullYear();
}

function copyArray(array) {
    let copy = [];
    for (let i = 0; i < array.length; i++) {
        copy.push(array[i]);
    }
    return copy;
}

module.exports = {
    monthNames: copyArray(MONTH_NAMES), // Immutable array clone
    shortMonthNames: copyArray(SHORT_MONTH_NAMES), // Immutable array clone
    formattedDate,
    formattedDatetime,
    formattedDatetimeDate,
    formattedShortDate
};