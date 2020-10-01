const slash = require("slash");

exports.addLeadingZeros = (number) => {
    if(number < 10) return '0' + number;
    return String(number);
}

exports.fixDirectoryPath = (path) => {
    // Add trailing slash if not present
    if(!path.endsWith('/') && !path.endsWith('\\')) {
        path = path.concat('/');
    }

    // Convert path to a posix path
    path = slash(path);

    // Remove slash duplicates
    path = path.replace('//', '/');

    return path;
}

exports.fixSlug = (slug) => {
    // Remove slashes and backslashes if present
    return slug.replace('/', '').replace('\\', '');
}
