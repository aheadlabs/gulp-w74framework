exports.addLeadingZeros = (number) => {
    if(number < 10) return '0' + number;
    return String(number);
}

exports.fixPath = (value) => {
    return value.replace(/\/\//g, '/');
}
