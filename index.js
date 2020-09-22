const
core = require('./core'),
gulp = require('gulp'),
{ logger } = require('./logger'),
processorPhp = require('./processor-php')
;

exports.build = () => {
    logger.info('Getting everything ready...')
    core.parseArguments();
    const paths = core.setPaths();
    const version = core.getVersion()

    logger.info(`Building your ${paths.theme_slug} v${version} WordPress theme!`);
    return gulp.series(
        processorPhp.go(paths)
    );
}

exports.watch = () => {
    logger.info('Building and watching your WordPress theme!');
}

// TODO Create gulp file demo (gulpfile-demo.js) on GitHub and update gulp-w74framework documentation
