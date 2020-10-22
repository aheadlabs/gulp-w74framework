const
del = require('del').sync,
errors = require('./errors.json'),
{ logger } = require('./logger'),
_paths = require('./paths.json'),
tools = require('./tools')
;

function parseArguments() {
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

function setPaths(paths) {
    // Fix parameters that have unresolved variables
    paths.parameters = tools.fixParameters(paths.parameters);

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

    // Fonts path
    paths.source_paths.fonts = tools.fixDirectoryPath(`${paths.source_paths.src}/${paths.defaults.assets}/${paths.defaults.fonts}/`);

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

    // Fonts path
    paths.output_paths.fonts = tools.fixDirectoryPath(`${paths.output_paths.dist}/${paths.defaults.assets}/${paths.defaults.fonts}/`);

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

        // Fonts path
        paths.output_wordpress_theme.fonts = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.fonts}/`);

        // Images path
        paths.output_wordpress_theme.images = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.images}/`);

        // JS path
        paths.output_wordpress_theme.js = tools.fixDirectoryPath(`${paths.output_wordpress_theme.dest}/${paths.defaults.assets}/${paths.defaults.js}/`);
    }


    logger.debug(`Paths: \n${JSON.stringify(paths)}`);
    return paths;
}

exports.getPaths = () => {
    const paths = setPaths(parseArguments());
    if(!paths) throw errors.path_not_set;
    return paths;
}

exports.deleteFiles = (path, suffix) => {
    logger.info(`Deleting files from ${path}...`);
    let fileList = del(`${path}${suffix}`, {force: true});
    if (fileList.length === 0) {
        logger.info('No files were deleted.');
    }
    else{
        logger.info(`${fileList.length} files were deleted.`);
        for (let index = 0; index < fileList.length; index++) {
            logger.debug(`Deleted file: ${fileList[index]}`);
        }
    }
}
