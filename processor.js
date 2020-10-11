const
core = require('./core'),
del = require('del').sync,
errors = require('./errors.json'),
gulp = require('gulp'),
{ logger } = require('./logger'),
newer = require('gulp-newer')
;

logger.info('Warming up...');
let _paths = core.parseArguments();
_paths = core.setPaths(_paths);
if(!_paths) throw errors.path_not_set;

exports.default = () => {
    logger.info('##### PHP #####');

    const source = `${_paths.source_paths.src}**/*.php`;
    const destination = `${_paths.output_paths.dist}`;

    return gulp.src(source)
        .on('end', () => logger.info(`Deleting PHP files from ${destination}...`))
        //.on('end', () => { return del(`${destination}**/*.php`, {force: true});})
        //.on('end', () => logger.info(`Determining whether files are newer than the existing ones at ${destination}...`))
        //.pipe(newer(destination))
        .on('end', () => logger.info(`Copying PHP files from ${source} to ${destination}...`))
        .pipe(gulp.dest(destination))
        .on('end', () => logger.info('Finished processing PHP files.'))
};

exports.distWordpress = () => {
    this.delete(`${_paths.output_wordpress_theme.dest}**/*.php`);
    this.copy(`${_paths.source_paths.src}**/*.php`, _paths.output_wordpress_theme.dest)
}
