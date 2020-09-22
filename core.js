const
browserSync = false,
config = require('./config.json'),
errors = require('./errors.json'),
{ logger } = require('./logger'),
paths = require('./paths.json'),
slash = require('slash'),
tools = require('./tools'),
wp_cli = require('./wp-cli')
;

exports.getVersion = function(wordPressPath) {
    const 
    template = wp_cli.getOption('w74_version', paths.output_paths.wordpress),
    now = new Date(),
    timestamp = now.getFullYear() 
        + tools.addLeadingZeros(now.getMonth()) 
        + tools.addLeadingZeros(now.getDate()) 
        + tools.addLeadingZeros(now.getHours()) 
        + tools.addLeadingZeros(now.getMinutes()) 
        + tools.addLeadingZeros(now.getSeconds());
    return template.replace('{timestamp}', timestamp);
}

exports.parseArguments = () => {
    // Try to find wp-path and wp-theme arguments
    for (let index = 2; index < process.argv.length; index++) {
        const argument = process.argv[index];

        // wp-path
        if(argument.startsWith('--wp-path=')) {
            let parts = argument.split('=');
            if (parts.length == 2) {
                paths.output_paths.wordpress = tools.fixPath(slash(`${parts[1]}/`));
                logger.debug(`WordPress path is: ${paths.output_paths.wordpress}`);
            }
        }

        // wp-theme
        if(argument.startsWith('--wp-theme=')) {
            let parts = argument.split('=');
            if (parts.length == 2) {
                paths.theme_slug = tools.fixPath(slash(parts[1]));
                logger.debug(`Theme slug is: ${paths.theme_slug}`);
            }
        }
    }

    if(!paths.output_paths.wordpress) {
        logger.error(errors.wordpress_path_not_valid);
        throw errors.wordpress_path_not_valid;
    }
    if(!paths.theme_slug) {
        logger.error(errors.theme_slug_not_valid);
        throw errors.theme_slug_not_valid;
    }
}

exports.setPaths = function(data) {
    /**
     * Source
     */

    // Assets path
    paths.source_paths.assets = tools.fixPath(`${paths.source_paths.src}/${paths.defaults.assets}/`);
    
    // CSS path
    paths.source_paths.css = tools.fixPath(`${paths.source_paths.src}/${paths.defaults.css}/`);
    
    // Images path
    paths.source_paths.images = tools.fixPath(`${paths.source_paths.src}/${paths.defaults.images}/`);
    
    // JS path
    paths.source_paths.js = tools.fixPath(`${paths.source_paths.src}/${paths.defaults.js}/`);

    /**
     * Output
     */
    
    // Theme path
    paths.output_paths.theme = tools.fixPath(`${paths.output_paths.wordpress}/${config.paths.wordpress_themes}/${paths.theme_slug}/`);

    // Assets path
    paths.output_paths.assets = tools.fixPath(`${paths.output_paths.theme}/${paths.defaults.assets}/`);

    // CSS path
    paths.output_paths.css = tools.fixPath(`${paths.output_paths.theme}/${paths.defaults.css}/`);

    // Images path
    paths.output_paths.images = tools.fixPath(`${paths.output_paths.theme}/${paths.defaults.images}/`);

    // JS path
    paths.output_paths.js = tools.fixPath(`${paths.output_paths.theme}/${paths.defaults.js}/`);


    return paths;
}
