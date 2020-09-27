const { series } = require('gulp');
const
core = require('./core'),
gulp = require('gulp'),
{ logger } = require('./logger'),
processorImages = require('./processor-images').default,
processorPhp = require('./processor-php').default
;

/*
    const version = core.getVersion()
*/

exports.build = gulp.series(
    processorPhp,
    processorImages
);

exports.watch = () => {
    logger.info('Building and watching your WordPress theme!');
}

// TODO Create gulp file demo (gulpfile-demo.js) on GitHub and update gulp-w74framework documentation
