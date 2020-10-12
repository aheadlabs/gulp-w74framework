const
slash = require("slash"),
util = require('util'),
wp_cli = require('./wp-cli')
;

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

exports.fixParameters = (parameters) => {
    let packageJson = this.getPackage(parameters.theme_path);

    let keys = Object.keys(parameters);
    
    for (let index = 0; index < keys.length; index++) {
        let value = String(parameters[keys[index]]);
        let match = /\${npm_package_(\w+)}/g.exec(value);
        if(match != null) {
            parameters[keys[index]] = value.replace(match[0], this.getPackageValueFromVariableSlug(packageJson, match[1]));
        }
    }

    return parameters;
}

exports.getPackageValueFromVariableSlug = (packageJson, slug) => {
    let parts = slug.split("_");
    let obj = packageJson;

    while (parts.length > 1) {
        const part = parts.shift();
        obj = packageJson[part];
    }
    
    return obj[parts[0]];
}

exports.getPackage = (packagePath) => {
    return require(`${packagePath}package.json`);
}

exports.getPackageVersion = (packageJson) => {
    return packageJson.version;
}

exports.getPackageName = (packageJson) => {
    return packageJson.name;
}

exports.getVersion = util.deprecate(() => {
    const
        template = wp_cli.getOption('w74_version', _paths.output_paths.wordpress),
        now = new Date(),
        timestamp = now.getFullYear()
            + tools.addLeadingZeros(now.getMonth())
            + tools.addLeadingZeros(now.getDate())
            + tools.addLeadingZeros(now.getHours())
            + tools.addLeadingZeros(now.getMinutes())
            + tools.addLeadingZeros(now.getSeconds());
    return template.replace('{timestamp}', timestamp);
}, 'This function is deprecated since the single source of truth for the version number should be the one specified in the package.json file and not in the database');
