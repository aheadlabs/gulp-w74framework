const
config = require('./config.json'),
errors = require('./errors.json'),
{ logger } = require('./logger'),
_paths = require('./paths.json'),
tools = require('./tools'),
util = require('util'),
wp_cli = require('./wp-cli')
;

exports.getVersionFromPackage = function(packagePath) {
    const packageJson = require(`${packagePath}package.json`);
    return packageJson.version;
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

exports.parseArguments = () => {
    // Filter arguments to the ones beginning by -
    const commandLineArguments = process.argv.filter(argument => argument.startsWith("-"));

    // Process each argument
    const searchExpression = /-{0,2}([\w-]+)="*(.+[^"])/;
    commandLineArguments.forEach(argument => {
        const argumentData = argument.match(searchExpression);
        if(argumentData.length !== 3) throw `${errors.parameter_syntax_not_valid} : ${argument}`;
        let _name = argumentData[1].replace(/-/g, '_');
        let _value = tools.fixDirectoryPath(argumentData[2]);
        _paths.parameters[_name] = _value;
        logger.debug(`Parsed parameter with name \"${_name}\" and value \"${_value}\"`);
    });

    return _paths;
}
exports.setPaths = function(paths) {
    /**
     * Slug
     */
    paths.parameters.theme_slug = tools.fixSlug(paths.parameters.theme_slug);

    
    /**
     * Source
     */

    // Root path
    paths.source_paths.root = tools.fixDirectoryPath(`${paths.parameters.theme_path}`);

    // Src path
    paths.source_paths.src = tools.fixDirectoryPath(`${paths.source_paths.root}/${paths.defaults.src}`);

    // Node modules path
    paths.source_paths.node_modules = tools.fixDirectoryPath(`${paths.source_paths.root}/${paths.defaults.node_modules}/`);

    // Assets path
    paths.source_paths.assets = tools.fixDirectoryPath(`${paths.source_paths.src}/${paths.defaults.assets}/`);
    
    // CSS path
    paths.source_paths.css = tools.fixDirectoryPath(`${paths.source_paths.src}/${paths.defaults.assets}/${paths.defaults.css}/`);
    
    // Images path
    paths.source_paths.images = tools.fixDirectoryPath(`${paths.source_paths.src}/${paths.defaults.assets}/${paths.defaults.images}/`);
    
    // JS path
    paths.source_paths.js = tools.fixDirectoryPath(`${paths.source_paths.src}/${paths.defaults.assets}/${paths.defaults.js}/`);

    /**
     * Output
     */

    // Dist path
    paths.output_paths.dist = tools.fixDirectoryPath(paths.parameters.dist);

    // Assets path
    paths.output_paths.assets = tools.fixDirectoryPath(`${paths.output_paths.dist}/${paths.defaults.assets}/`);

    // CSS path
    paths.output_paths.css = tools.fixDirectoryPath(`${paths.output_paths.dist}/${paths.defaults.assets}/${paths.defaults.css}/`);

    // Images path
    paths.output_paths.images = tools.fixDirectoryPath(`${paths.output_paths.dist}/${paths.defaults.assets}/${paths.defaults.images}/`);

    // JS path
    paths.output_paths.js = tools.fixDirectoryPath(`${paths.output_paths.dist}/${paths.defaults.assets}/${paths.defaults.js}/`);

    /**
     * Output WordPress
     */

    if (paths.parameters.wordpress_theme_path){
        // Destination path
        paths.output_wordpress_theme.dest = tools.fixDirectoryPath(paths.parameters.wordpress_theme_path);

        // Assets path
        paths.output_wordpress_theme.assets = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/`);

        // CSS path
        paths.output_wordpress_theme.css = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.css}/`);

        // Images path
        paths.output_wordpress_theme.images = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.images}/`);

        // JS path
        paths.output_wordpress_theme.js = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.js}/`);
    }


    logger.debug(JSON.stringify(paths));
    return paths;
}
